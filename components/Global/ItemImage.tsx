import React, { FC } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';


type ItemImageProps = ImageProps & {
    size?: 'xs' | 'sm' | 'lg';
};

const ItemImage: FC<ItemImageProps> = ( { className, size, src, alt } ) => {
    let imageSize = 48;
    if ( size === 'xs' ) {
        imageSize = 28;
    } else if ( size === 'sm' ) {
        imageSize = 32;
    } else if ( size === 'lg' ) {
        imageSize = 64;
    }

    return (
        <Image
            className={ cn( 'rounded', className ) }
            src={ src }
            alt={ alt }
            width={ imageSize }
            height={ imageSize } />
    );
};

export default ItemImage;
