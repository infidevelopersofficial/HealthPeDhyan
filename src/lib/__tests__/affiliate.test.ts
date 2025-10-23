import { buildAffiliateUrl, getMerchantFromUrl } from '../affiliate';

describe('Affiliate Utilities', () => {
  describe('buildAffiliateUrl', () => {
    it('should add Amazon affiliate tag', () => {
      process.env.AFFILIATE_AMAZON_TAG = 'test-tag';
      const url = buildAffiliateUrl('https://amazon.in/product', 'AMAZON');
      expect(url).toContain('tag=test-tag');
    });

    it('should add Flipkart affiliate param', () => {
      process.env.AFFILIATE_FLIPKART_PARAM = 'test-affid';
      const url = buildAffiliateUrl('https://flipkart.com/product', 'FLIPKART');
      expect(url).toContain('affid=test-affid');
    });

    it('should handle invalid URLs gracefully', () => {
      const url = buildAffiliateUrl('not-a-url', 'AMAZON');
      expect(url).toBe('not-a-url');
    });
  });

  describe('getMerchantFromUrl', () => {
    it('should detect Amazon', () => {
      expect(getMerchantFromUrl('https://amazon.in/product')).toBe('AMAZON');
    });

    it('should detect Flipkart', () => {
      expect(getMerchantFromUrl('https://flipkart.com/product')).toBe('FLIPKART');
    });

    it('should return OTHER for unknown merchants', () => {
      expect(getMerchantFromUrl('https://example.com/product')).toBe('OTHER');
    });
  });
});
