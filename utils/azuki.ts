import { IpMetadata, PILFlavor } from '@story-protocol/core-sdk'
import { client, networkInfo } from './config'
import { Hex } from 'viem'
import { uploadJSONToIPFS } from './functions/uploadToIpfs'
import { createHash } from 'crypto'
import axios from 'axios'

const SPGNFTContractAddress = '0xBbF6A90923F54530B2783CB92444f3d5F7006864'

const imageUrl = 'https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/8260.png'

async function getImageHashFromUrl(url: string): Promise<Hex> {
    return '0xcdf6301e17db7830b14ab78ae7cf3a2b8b296865d415fce7abd7b8e1816534d6'
}

async function main() {
    const imageHash = await getImageHashFromUrl(imageUrl)
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
        title: `Azuki #8260`,
        description: 'Take the red bean to join the garden. View the collection at azuki.com/gallery.',
        image: imageUrl,
        imageHash: imageHash,
        mediaUrl: imageUrl,
        mediaHash: imageHash,
        mediaType: 'image/png',
        xChain: {
            chain: 'Ethereum',
            url: `https://opensea.io/item/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/8260`,
            contractAddress: '0xed5af388653567af2f388e6224dc7c4b3241c544',
            tokenId: 8260,
        },
    })

    const nftMetadata = {
        name: 'Azuki #8260',
        image: imageUrl,
        attributes: [
            {
                trait_type: 'Type',
                value: 'Human',
            },
            {
                trait_type: 'Hair',
                value: 'Teal Bob',
            },
            {
                trait_type: 'Clothing',
                value: 'Black Ninja Top',
            },
            {
                trait_type: 'Eyes',
                value: 'Calm',
            },
            {
                trait_type: 'Mouth',
                value: 'Grass',
            },
            {
                trait_type: 'Offhand',
                value: 'Leather Katana',
            },
            {
                trait_type: 'Background',
                value: 'Off White C',
            },
        ],
    }

    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = ('0x' + createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')) as Hex

    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = ('0x' + createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')) as Hex

    const register = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: PILFlavor.nonCommercialSocialRemixing({}),
            },
        ],
        recipient: '0xc97612D670232D28a517D8d35168b6ef36F5Ab76',
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: ipHash,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: nftHash,
        },
    })

    console.log('Root IPA created:', {
        'Transaction Hash': register.txHash,
        'IPA ID': register.ipId,
    })
    console.log(`View on the explorer: ${networkInfo.protocolExplorer}/ipa/${register.ipId}`)
}

main()
