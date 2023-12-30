import { type FC, type PropsWithChildren } from 'react';

import Flex, { type IFlexProps } from '../Flex/Flex';


type THStackProps = Omit<IFlexProps, 'direction'>;

export const Row: FC<PropsWithChildren<THStackProps>> = ({ children, ...props }) => {
    return (
        <Flex
            direction="row"
            { ...props }
        >
            { children }
        </Flex>
    );
};
