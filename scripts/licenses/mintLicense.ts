import { Address } from 'viem'
import { client } from '../../utils/config'

// TODO: Replace with your own IP ID and license terms id
const IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'
const LICENSE_TERMS_ID: number = 1

const main = async function () {
    // 1. Mint License Tokens
    //
    // Docs: https://docs.story.foundation/sdk-reference/license#mintlicensetokens
    const response = await client.license.mintLicenseTokens({
        licenseTermsId: LICENSE_TERMS_ID,
        licensorIpId: IP_ID,
        amount: 1,
    })

    console.log('License minted:', {
        'Transaction Hash': response.txHash,
        'License Token IDs': response.licenseTokenIds,
    })
}

main()
