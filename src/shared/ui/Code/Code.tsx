import {
    type FC, memo, useCallback
} from 'react';
import CopyIcon from 'shared/assets/icons/copy-20-20.svg';
import _c from 'shared/helpers/classNames';

import cls from './Code.module.scss';
import AppButton, { EAppButtonTheme } from '../AppButton';


interface ICodeProps {
    className?: string;
    text: string;
}

const Code: FC<ICodeProps> = ({ className, text }) => {

    const onCopy = useCallback(() => {
        navigator.clipboard.writeText(text);
    }, [ text ]);

    return (
        <pre className={ _c(cls.code,  [ className ]) }>
            <AppButton
                onClick={ onCopy }
                className={ cls['copy-btn'] }
                theme={ EAppButtonTheme.CLEAR }
            >
                <CopyIcon className={ cls['copy-icon'] } />
            </AppButton>
            <code>
                { text }
            </code>
        </pre>
    );
};

export default memo(Code);
