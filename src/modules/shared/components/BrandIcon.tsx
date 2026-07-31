import { Palmtree, Hotel, Building2, Sun, Waves, Compass, Anchor, Sparkles, Crown } from 'lucide-react';

interface BrandIconProps {
    iconName?: string;
    className?: string;
}

export function BrandIcon({ iconName = 'Palmtree', className = 'w-5 h-5 text-[#c89349]' }: BrandIconProps) {
    switch (iconName) {
        case 'Hotel':
            return <Hotel className={className} />;
        case 'Building2':
            return <Building2 className={className} />;
        case 'Sun':
            return <Sun className={className} />;
        case 'Waves':
            return <Waves className={className} />;
        case 'Compass':
            return <Compass className={className} />;
        case 'Anchor':
            return <Anchor className={className} />;
        case 'Sparkles':
            return <Sparkles className={className} />;
        case 'Crown':
            return <Crown className={className} />;
        case 'Palmtree':
        default:
            return <Palmtree className={className} />;
    }
}