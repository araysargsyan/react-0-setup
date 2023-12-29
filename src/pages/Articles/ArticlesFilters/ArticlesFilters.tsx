import {
    type FC, memo, useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import _c from 'shared/helpers/classNames';
import { useActions } from 'shared/hooks/redux';
import Card from 'shared/ui/Card';
import AppInput from 'shared/ui/AppInput';
import { useSelector } from 'react-redux';
import {
    getArticlesOrder,
    getArticlesSearch,
    getArticlesSort,
    getArticlesType,
    articlesActionCreators,
} from 'store/Articles';

import cls from './ArticlesFilters.module.scss';


interface IArticlesFiltersProps {
    className?: string;
}

const ArticlesFilters: FC<IArticlesFiltersProps> = ({ className }) => {
    const { t } = useTranslation();
    const sort = useSelector(getArticlesSort);
    const order = useSelector(getArticlesOrder);
    const search = useSelector(getArticlesSearch);
    const type = useSelector(getArticlesType);

    // const fetchData = useCallback(() => {
    //     dispatch(fetchArticlesList({ replace: true }));
    // }, [ dispatch ]);
    //
    // const debouncedFetchData = useDebounce(fetchData, 500);

    const filterActionsKeys = [ 'setSort', 'setOrder', 'setSearch', 'setType' ] as const;
    const actions = useActions(
        articlesActionCreators,
        [ ...filterActionsKeys, 'fetchAll' ]
    );
    const onChange = useCallback(<
        KEY extends typeof filterActionsKeys[number],
        ARGS extends Parameters<(typeof actions)[KEY]>
    >(key: KEY) => (...args: ARGS) => {
            (actions[key] as ((...args: ARGS) => void))(...args);
            actions.fetchAll();
        }, [ actions ]);

    return (
        <div className={ _c('',  [ className ]) }>
            <div className={ cls['sort-wrapper'] }>
                { /*<ArticleSortSelector
                    order={ order }
                    sort={ sort }
                    onChangeOrder={ onChangeOrder }
                    onChangeSort={ onChangeSort }
                />
                <ArticleViewSelector
                    view={ view }
                    onViewClick={ onChangeView }
                />*/ }
            </div>
            <Card className={ cls.search }>
                <AppInput
                    name="search"
                    onChange={ onChange('setSearch') }
                    value={ search }
                    placeholder={ t('Поиск') }
                />
            </Card>
            { /*<ArticleTypeTabs
                value={ type }
                onChangeType={ onChangeType }
                className={ cls.tabs }
            />*/ }
        </div>
    );
};

export default memo(ArticlesFilters);
