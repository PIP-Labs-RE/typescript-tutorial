import { Address, toHex } from 'viem'
import { RoyaltyPolicyLRP, SPGNFTContractAddress } from '../../utils/utils'
import { client } from '../../utils/config'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'

// TODO: This is Ippy on Aeneid. The license terms specify 1 $WIP mint fee
// and a 5% commercial rev share. You can change these.
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'
const PARENT_LICENSE_TERMS_ID: number = 96

const main = async function () {
    // 1. Mint and Register IP asset and make it a derivative of the parent IP Asset
    //
    // You will be paying for the License Token using $WIP:
    // https://aeneid.storyscan.xyz/address/0x1514000000000000000000000000000000000000
    // If you don't have enough $WIP, the function will auto wrap an equivalent amount of $IP into
    // $WIP for you.
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#registerderivativeipasset
    const childIp = await client.ipAsset.registerDerivativeIpAsset({
        nft: { type: 'mint', spgNftContract: SPGNFTContractAddress },
        derivData: {
            parentIpIds: [PARENT_IP_ID],
            licenseTermsIds: [PARENT_LICENSE_TERMS_ID],
        },
        // NOTE: The below metadata is not configured properly. It is just to make things simple.
        // See `simpleMintAndRegister.ts` for a proper example.
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
    })
    console.log('Derivative IPA created and linked:', {
        'Transaction Hash': childIp.txHash,
        'IPA ID': childIp.ipId,
    })

    // 2. Parent Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const parentClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: PARENT_IP_ID,
        claimer: PARENT_IP_ID,
        currencyTokens: [WIP_TOKEN_ADDRESS],
        childIpIds: [],
        royaltyPolicies: [],
    })
    console.log('Parent claimed revenue receipt:', parentClaimRevenue.claimedTokens)
}

main()
