import { zeroAddress } from 'viem'
import { client } from '../config'
import { uploadJSONToIPFS } from './uploadToIpfs'

const main = async function () {
    const collectionData = {
        name: 'RCADE Stems',
        description: 'All licensed stems on RCADE, the music platform built for the remix era.',
        image: 'https://ttmbengqanqzfrkjajgk.supabase.co/storage/v1/object/public/images/rcade-icon.png',
        banner_image: 'https://ttmbengqanqzfrkjajgk.supabase.co/storage/v1/object/public/images/rcade-banner.jpg',
        external_link: 'https://rcade.co',
    }
    const collectionIpfsHash = await uploadJSONToIPFS(collectionData)
    // Create a new SPG NFT collection
    //
    // NOTE: Use this code to create a new SPG NFT collection. You can then use the
    // `newCollection.spgNftContract` address as the `spgNftContract` argument in
    // functions like `mintAndRegisterIpAssetWithPilTerms` in the
    // `simpleMintAndRegisterSpg.ts` file.
    //
    // You will mostly only have to do this once. Once you get your nft contract address,
    // you can use it in SPG functions.
    //
    const newCollection = await client.nftClient.createNFTCollection({
        name: 'RCADE',
        symbol: 'RCADE',
        isPublicMinting: true,
        mintOpen: true,
        mintFeeRecipient: zeroAddress,
        contractURI: `https://ipfs.io/ipfs/${collectionIpfsHash}`,
    })

    console.log('New collection created:', {
        'SPG NFT Contract Address': newCollection.spgNftContract,
        'Transaction Hash': newCollection.txHash,
    })
}

main()
