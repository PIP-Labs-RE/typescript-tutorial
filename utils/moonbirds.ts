import { IpMetadata, PILFlavor } from '@story-protocol/core-sdk'
import { client, networkInfo } from './config'
import { Hex } from 'viem'
import { uploadJSONToIPFS } from './functions/uploadToIpfs'
import { createHash } from 'crypto'
import axios from 'axios'

type Moonbird = {
    tokenId: number
    imageUrl: string
    nftMetadataHash: Hex
    nftIpfsHash: string
    imageHash: Hex
}

const moonbirdIds: number[] = [
    5525, 9709, 1776, 7863, 7069, 9993, 9984, 7078, 9981, 6970, 9999, 7051, 6993, 6997, 6969, 6965, 7053, 7093, 2421, 6920, 8147, 7050, 123,
    9206, 2223,
]

// const moonbirdIds: number[] = [5525, 9709, 1776]

async function getImageHashFromUrl(url: string): Promise<Hex> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)
    return ('0x' + createHash('sha256').update(buffer).digest('hex')) as Hex
}

async function getMoonbirdNftMetadata(tokenId: number): Promise<{ nftIpfsHash: string; nftMetadataHash: Hex }> {
    const response = await fetch(`https://live---metadata-5covpqijaa-uc.a.run.app/metadata/${tokenId}`)
    const data = (await response.json()) as any

    const nftMetadataData = {
        ...data,
        image: `https://collection-assets.proof.xyz/moonbirds/images/${tokenId}.png`,
        x_debug: undefined,
    }

    const nftIpfsHash = await uploadJSONToIPFS(nftMetadataData)
    const nftMetadataHash = ('0x' + createHash('sha256').update(JSON.stringify(nftMetadataData)).digest('hex')) as Hex
    return {
        nftIpfsHash,
        nftMetadataHash,
    }
}

async function getMoonbirds(): Promise<Moonbird[]> {
    let response: Moonbird[] = []
    for (const tokenId of moonbirdIds) {
        let nftMetadata = await getMoonbirdNftMetadata(tokenId)
        let imageUrl = `https://collection-assets.proof.xyz/moonbirds/images/${tokenId}.png`
        let moonbird: Moonbird = {
            tokenId: tokenId,
            imageUrl: imageUrl,
            imageHash: await getImageHashFromUrl(imageUrl),
            nftMetadataHash: nftMetadata.nftMetadataHash,
            nftIpfsHash: nftMetadata.nftIpfsHash,
        }
        response.push(moonbird)
    }

    return response
}

const SPGNFTContractAddress = '0x7bed503977D576FcF1Af4C9F0b0766a8CF2144D6'

async function main() {
    const moonbirds = await getMoonbirds()
    console.log(moonbirds)

    for (const moonbird of moonbirds) {
        const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
            title: `Moonbirds #${moonbird.tokenId}`,
            description:
                'Moonbirds is a home for creatives, dreamers, and collectors seeking real connection as we all contribute to the future of web3 art, culture, and technology.',
            // creators: [
            //     {
            //         name: 'Justin Mezzell',
            //         address: '0x0000000000000000000000000000000000000000',
            //         contributionPercent: 100,
            //         image: 'https://www.proof.xyz/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fmbkeph6hcz7u%2F6JOiqMFXDlJeL4G5yhybau%2F442f25cacd78f1a68c295cb5b4547568%2FMB.png&w=2560&q=75',
            //         role: 'artist',
            //         description:
            //             'Justin Mezzell is the Co-Founder and Chief Product Officer of PROOF and the artist who designed Moonbirds.',
            //         socialMedia: [
            //             {
            //                 platform: 'website',
            //                 url: 'https://dribbble.com/JustinMezzell',
            //             },
            //             {
            //                 platform: 'twitter',
            //                 url: 'https://x.com/JustinMezzell',
            //             },
            //             {
            //                 platform: 'instagram',
            //                 url: 'https://www.instagram.com/justinmezzell/',
            //             },
            //         ],
            //     },
            // ],
            image: moonbird.imageUrl,
            imageHash: moonbird.imageHash,
            mediaUrl: moonbird.imageUrl,
            mediaHash: moonbird.imageHash,
            mediaType: 'image/png',
            xChain: {
                chain: 'Ethereum',
                url: `https://opensea.io/item/ethereum/0x23581767a106ae21c074b2276d25e5c3e136a68b/${moonbird.tokenId}`,
                contractAddress: '0x23581767a106ae21c074b2276d25e5c3e136a68b',
                tokenId: moonbird.tokenId,
            },
        })

        const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
        const ipHash = ('0x' + createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')) as Hex

        const register = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
            spgNftContract: SPGNFTContractAddress,
            licenseTermsData: [
                {
                    terms: PILFlavor.nonCommercialSocialRemixing({}),
                },
            ],
            ipMetadata: {
                ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                ipMetadataHash: ipHash,
                nftMetadataURI: `https://ipfs.io/ipfs/${moonbird.nftIpfsHash}`,
                nftMetadataHash: moonbird.nftMetadataHash,
            },
        })

        console.log('Root IPA created:', {
            'Transaction Hash': register.txHash,
            'IPA ID': register.ipId,
        })
        console.log(`View on the explorer: ${networkInfo.protocolExplorer}/ipa/${register.ipId}`)
    }
}

main()
