import type {ComponentMeta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import Badge from '@components/Badge';
import SelectionList from '@components/SelectionList';
import RadioListItem from '@components/SelectionList/RadioListItem';
// eslint-disable-next-line no-restricted-imports
import {defaultStyles} from '@styles/index';
import CONST from '@src/CONST';
import withNavigationFallback from '@components/withNavigationFallback';
import type { BaseSelectionListProps, ListItem } from '@components/SelectionList/types';

const SelectionListWithNavigation = withNavigationFallback(SelectionList);

/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story: ComponentMeta<typeof SelectionList> = {
    title: 'Components/SelectionList',
    component: SelectionList,
};

const SECTIONS = [
    {
        data: [
            {
                text: 'Option 1',
                keyForList: 'option-1',
                isSelected: false,
            },
            {
                text: 'Option 2',
                keyForList: 'option-2',
                isSelected: false,
            },
            {
                text: 'Option 3',
                keyForList: 'option-3',
                isSelected: false,
            },
        ],
        indexOffset: 0,
        isDisabled: false,
    },
    {
        data: [
            {
                text: 'Option 4',
                keyForList: 'option-4',
                isSelected: false,
            },
            {
                text: 'Option 5',
                keyForList: 'option-5',
                isSelected: false,
            },
            {
                text: 'Option 6',
                keyForList: 'option-6',
                isSelected: false,
            },
        ],
        indexOffset: 3,
        isDisabled: false,
    },
];

function Default(props: BaseSelectionListProps<ListItem>) {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const sections = props.sections.map((section) => {
        const data = section.data.map((item, index) => {
            const isSelected = selectedIndex === index + (section?.indexOffset ?? 0);
            return {...item, isSelected};
        });

        return {...section, data};
    });

    const onSelectRow = (item: ListItem) => {
        sections.forEach((section) => {
            const newSelectedIndex = section.data.findIndex((option) => option.keyForList === item.keyForList);

            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex + (section?.indexOffset ?? 0));
            }
        });
    };

    return (
        <SelectionListWithNavigation
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            sections={sections}
            ListItem={RadioListItem}
            onSelectRow={onSelectRow}
        />
    );
}

Default.args = {
    sections: SECTIONS,
    onSelectRow: () => {},
    initiallyFocusedOptionKey: 'option-2',
};

function WithTextInput(props: BaseSelectionListProps<ListItem>) {
    const [searchText, setSearchText] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(1);

    const sections = props.sections.map((section) => {
        const data = section.data.reduce<Array<ListItem & {isSelected: boolean}>>(
            (memo, item, index) => {
                if (!item.text.toLowerCase().includes(searchText.trim().toLowerCase())) {
                    return memo;
                }

                const isSelected = selectedIndex === index + (section?.indexOffset ?? 0);
                memo.push({...item, isSelected});
                return memo;
            },
            [],
        );

        return {...section, data};
    });

    const onSelectRow = (item: ListItem) => {
        sections.forEach((section) => {
            const newSelectedIndex = section.data.findIndex((option) => option.keyForList === item.keyForList);

            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex + (section?.indexOffset ?? 0));
            }
        });
    };

    return (
        <SelectionListWithNavigation
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            sections={sections}
            ListItem={RadioListItem}
            textInputValue={searchText}
            onChangeText={setSearchText}
            onSelectRow={onSelectRow}
        />
    );
}

WithTextInput.args = {
    sections: SECTIONS,
    textInputLabel: 'Option list',
    textInputPlaceholder: 'Search something...',
    textInputMaxLength: 4,
    inputMode: CONST.INPUT_MODE.NUMERIC,
    initiallyFocusedOptionKey: 'option-2',
    onSelectRow: () => {},
    onChangeText: () => {},
};

function WithHeaderMessage(props: BaseSelectionListProps<ListItem>) {
    return (
        <WithTextInput
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}

WithHeaderMessage.args = {
    ...WithTextInput.args,
    headerMessage: 'No results found',
    sections: [],
};

function WithAlternateText(props: BaseSelectionListProps<ListItem>) {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const sections = props.sections.map((section) => {
        const data = section.data.map((item, index) => {
            const isSelected = selectedIndex === index + (section?.indexOffset ?? 0);

            return {
                ...item,
                alternateText: `Alternate ${index + 1}`,
                isSelected,
            };
        });

        return {...section, data};
    });

    const onSelectRow = (item: ListItem) => {
        sections.forEach((section) => {
            const newSelectedIndex = section.data.findIndex((option) => option.keyForList === item.keyForList);

            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex + (section?.indexOffset ?? 0));
            }
        });
    };
    return (
        <SelectionListWithNavigation
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            sections={sections}
            onSelectRow={onSelectRow}
        />
    );
}

WithAlternateText.args = {
    // ...Default.args,
    sections: SECTIONS,
    onSelectRow: () => {},
    initiallyFocusedOptionKey: 'option-2',
};

function MultipleSelection(props: BaseSelectionListProps<ListItem>) {
    const [selectedIds, setSelectedIds] = useState(['option-1', 'option-2']);

    const memo = useMemo(() => {
        const allIds: string[] = [];

        const sections = props.sections.map((section) => {
            const data = section.data.map((item, index) => {
                allIds.push(item.keyForList);
                const isSelected = selectedIds.includes(item.keyForList);
                const isAdmin = index + (section?.indexOffset ?? 0) === 0;

                return {
                    ...item,
                    isSelected,
                    alternateText: `${item.keyForList}@email.com`,
                    accountID: Number(item.keyForList),
                    login: item.text,
                    rightElement: isAdmin && (
                        <Badge
                            text="Admin"
                            textStyles={defaultStyles.textStrong}
                            badgeStyles={defaultStyles.badgeBordered}
                        />
                    ),
                };
            });

            return {...section, data};
        });

        return {sections, allIds};
    }, [props.sections, selectedIds]);

    const onSelectRow = (item: ListItem) => {
        const newSelectedIds = selectedIds.includes(item.keyForList) ? selectedIds.filter((i) => i !== item.keyForList) : [...selectedIds, item.keyForList];
        setSelectedIds(newSelectedIds);
    };

    const onSelectAll = () => {
        if (selectedIds.length === memo.allIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(memo.allIds);
        }
    };

    return (
        <SelectionListWithNavigation
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            sections={memo.sections}
            ListItem={RadioListItem}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
        />
    );
}

MultipleSelection.args = {
    ...Default.args,
    canSelectMultiple: true,
    onSelectAll: () => {},
};

function WithSectionHeader(props: BaseSelectionListProps<ListItem>) {
    const [selectedIds, setSelectedIds] = useState(['option-1', 'option-2']);

    const memo = useMemo(() => {
        const allIds: string[] = [];

        const sections = props.sections.map((section, sectionIndex) => {
            const data = section.data.map((item, itemIndex) => {
                allIds.push(item.keyForList);
                const isSelected = selectedIds.includes(item.keyForList);
                const isAdmin = itemIndex + (section?.indexOffset ?? 0) === 0;

                return {
                    ...item,
                    isSelected,
                    alternateText: `${item.keyForList}@email.com`,
                    accountID: Number(item.keyForList),
                    login: item.text,
                    rightElement: isAdmin && (
                        <Badge
                            text="Admin"
                            textStyles={defaultStyles.textStrong}
                            badgeStyles={defaultStyles.badgeBordered}
                        />
                    ),
                };
            });

            return {...section, data, title: `Section ${sectionIndex + 1}`};
        });

        return {sections, allIds};
    }, [props.sections, selectedIds]);

    const onSelectRow = (item: ListItem) => {
        const newSelectedIds = selectedIds.includes(item.keyForList) ? selectedIds.filter((i) => i !== item.keyForList) : [...selectedIds, item.keyForList];
        setSelectedIds(newSelectedIds);
    };

    const onSelectAll = () => {
        if (selectedIds.length === memo.allIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(memo.allIds);
        }
    };

    return (
        <SelectionListWithNavigation
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            sections={memo.sections}
            ListItem={RadioListItem}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
        />
    );
}

WithSectionHeader.args = {
    ...MultipleSelection.args,
};

function WithConfirmButton(props: BaseSelectionListProps<ListItem>) {
    const [selectedIds, setSelectedIds] = useState(['option-1', 'option-2']);

    const memo = useMemo(() => {
        const allIds: string[] = [];

        const sections = props.sections.map((section, sectionIndex) => {
            const data = section.data.map((item, itemIndex) => {
                allIds.push(item.keyForList);
                const isSelected = selectedIds.includes(item.keyForList);
                const isAdmin = itemIndex + (section.indexOffset ?? 0) === 0;

                return {
                    ...item,
                    isSelected,
                    alternateText: `${item.keyForList}@email.com`,
                    accountID: Number(item.keyForList),
                    login: item.text,
                    rightElement: isAdmin && (
                        <Badge
                            text="Admin"
                            textStyles={defaultStyles.textStrong}
                            badgeStyles={defaultStyles.badgeBordered}
                        />
                    ),
                };
            });

            return {...section, data, title: `Section ${sectionIndex + 1}`};
        });

        return {sections, allIds};
    }, [props.sections, selectedIds]);

    const onSelectRow = (item: ListItem) => {
        const newSelectedIds = selectedIds.includes(item.keyForList) ? selectedIds.filter((i) => i !== item.keyForList) : [...selectedIds, item.keyForList];
        setSelectedIds(newSelectedIds);
    };

    const onSelectAll = () => {
        if (selectedIds.length === memo.allIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(memo.allIds);
        }
    };

    return (
        <SelectionListWithNavigation
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            sections={memo.sections}
            ListItem={RadioListItem}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
        />
    );
}

WithConfirmButton.args = {
    ...MultipleSelection.args,
    onConfirm: () => {},
    confirmButtonText: 'Confirm',
};

export {Default, WithTextInput, WithHeaderMessage, WithAlternateText, MultipleSelection, WithSectionHeader, WithConfirmButton};
export default story;