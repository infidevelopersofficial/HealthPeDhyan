import { AffiliateMerchant } from '@prisma/client';

/**
 * Build affiliate URL with proper tracking parameters
 */
export function buildAffiliateUrl(
  baseUrl: string,
  merchant: AffiliateMerchant,
  params?: Record<string, string>
): string {
  try {
    const url = new URL(baseUrl);

    // Add merchant-specific parameters
    switch (merchant) {
      case 'AMAZON':
        const amazonTag = process.env.AFFILIATE_AMAZON_TAG;
        if (amazonTag) {
          url.searchParams.set('tag', amazonTag);
        }
        break;

      case 'FLIPKART':
        const flipkartParam = process.env.AFFILIATE_FLIPKART_PARAM;
        if (flipkartParam) {
          url.searchParams.set('affid', flipkartParam);
        }
        break;

      case 'OTHER':
        // Add custom params if provided
        break;
    }

    // Add any additional custom params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  } catch (error) {
    console.error('Error building affiliate URL:', error);
    return baseUrl;
  }
}

/**
 * Extract merchant from URL
 */
export function getMerchantFromUrl(url: string): AffiliateMerchant {
  if (url.includes('amazon.')) return 'AMAZON';
  if (url.includes('flipkart.')) return 'FLIPKART';
  return 'OTHER';
}
