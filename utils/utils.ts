import { LicenseTerms, LicensingConfig } from '@story-protocol/core-sdk'
import { Address, zeroAddress } from 'viem'
import dotenv from 'dotenv'
import { networkInfo } from './config'

dotenv.config()

// Export contract addresses with appropriate defaults based on network
export const NFTContractAddress: Address =
    (process.env.NFT_CONTRACT_ADDRESS as Address) || networkInfo.defaultNFTContractAddress || zeroAddress

export const SPGNFTContractAddress: Address =
    (process.env.SPG_NFT_CONTRACT_ADDRESS as Address) || networkInfo.defaultSPGNFTContractAddress || zeroAddress

// This is a pre-configured PIL Flavor:
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#flavor-%231%3A-non-commercial-social-remixing
export const NonCommercialSocialRemixingTermsId: number = 1
export const NonCommercialSocialRemixingTerms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: zeroAddress,
    defaultMintingFee: 0n,
    expiration: 0n,
    commercialUse: false,
    commercialAttribution: false,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: 0,
    commercialRevCeiling: 0n,
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: 0n,
    currency: zeroAddress,
    uri: 'https://github.com/piplabs/pil-document/blob/998c13e6ee1d04eb817aefd1fe16dfe8be3cd7a2/off-chain-terms/NCSR.json',
}

// Docs: https://docs.story.foundation/developers/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E'
export const RoyaltyPolicyLRP: Address = '0x9156e603C949481883B1d3355c6f1132D191fC41'

export const defaultLicensingConfig: LicensingConfig = {
    mintingFee: 0n,
    isSet: false,
    disabled: false,
    commercialRevShare: 0,
    expectGroupRewardPool: zeroAddress,
    expectMinimumGroupRewardShare: 0,
    licensingHook: zeroAddress,
    hookData: '0x',
}

export function convertRoyaltyPercentToTokens(royaltyPercent: number): number {
    // there are 100,000,000 tokens total (100, but 6 decimals)
    return royaltyPercent * 1_000_000
}
