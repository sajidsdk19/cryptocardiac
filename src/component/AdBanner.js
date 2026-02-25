import { useEffect } from 'react';

/**
 * Reusable Google AdSense banner component.
 *
 * Props:
 *  - adSlot  (string, required) – the Ad Slot ID from your AdSense account
 *  - adFormat (string, default 'auto')
 *  - fullWidthResponsive (bool, default true)
 *  - style (object) – extra wrapper styles (e.g. background, padding)
 *
 * Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual AdSense Publisher ID.
 */
const AdBanner = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style = {},
}) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // AdSense may throw in non-browser environments
        }
    }, []);

    return (
        <div
            style={{
                textAlign: 'center',
                overflow: 'hidden',
                width: '100%',
                ...style,
            }}
        >
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3326984644187937"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
                data-adtest={window.location.hostname === 'localhost' ? 'on' : undefined}
            />
        </div>
    );
};

export default AdBanner;
