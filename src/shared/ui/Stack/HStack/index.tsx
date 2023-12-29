import { type FC } from 'react';

import Flex, { type IFlexProps } from '../Flex/Flex';


type THStackProps = Omit<IFlexProps, 'direction'>;

export const HStack: FC<THStackProps> = (props) => {
    return (
        <Flex
            direction="row"
            { ...props }
        />
    );
};
