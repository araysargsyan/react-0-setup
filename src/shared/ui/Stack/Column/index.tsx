import { type FC, type PropsWithChildren } from 'react';

import Flex, { type IFlexProps } from '../Flex/Flex';


type TVStackProps = Omit<IFlexProps, 'direction'>;

export const Column: FC<PropsWithChildren<TVStackProps>> = ({ children, ...props }) => {
    const { align = 'start' } = props;
    return (
        <Flex
            { ...props }
            direction="column"
            align={ align }
        >
            { children }
        </Flex>
    );
};
