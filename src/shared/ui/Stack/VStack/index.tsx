import { type FC } from 'react';

import Flex, { type IFlexProps } from '../Flex/Flex';


type TVStackProps = Omit<IFlexProps, 'direction'>;

export const VStack: FC<TVStackProps> = (props) => {
    const { align = 'start' } = props;
    return (
        <Flex
            { ...props }
            direction="column"
            align={ align }
        />
    );
};
