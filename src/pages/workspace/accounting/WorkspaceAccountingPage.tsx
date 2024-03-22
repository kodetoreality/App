import React, {useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Button from '@components/Button';
import ConfirmModal from '@components/ConfirmModal';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import * as Expensicons from '@components/Icon/Expensicons';
import * as Illustrations from '@components/Icon/Illustrations';
import MenuItem from '@components/MenuItem';
import type {MenuItemProps} from '@components/MenuItem';
import MenuItemList from '@components/MenuItemList';
import ScreenWrapper from '@components/ScreenWrapper';
import ScrollView from '@components/ScrollView';
import Section from '@components/Section';
import ThreeDotsMenu from '@components/ThreeDotsMenu';
import type ThreeDotsMenuProps from '@components/ThreeDotsMenu/types';
import useLocalize from '@hooks/useLocalize';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
// import useWaitForNavigation from '@hooks/useWaitForNavigation';
import useWindowDimensions from '@hooks/useWindowDimensions';
import type {AnchorPosition} from '@styles/index';
import variables from '@styles/variables';
import CONST from '@src/CONST';

function WorkspaceAccountingPage() {
    const theme = useTheme();
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    // const waitForNavigate = useWaitForNavigation();
    const {isSmallScreenWidth, windowWidth} = useWindowDimensions();

    const [threeDotsMenuPosition, setThreeDotsMenuPosition] = useState<AnchorPosition>({horizontal: 0, vertical: 0});
    const [policyIsConnectedToAccountingSystem, setPolicyIsConnectedToAccountingSystem] = useState(false);
    const [isSyncInProgress, setIsSyncInProgress] = useState(false);
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
    const threeDotsMenuContainerRef = useRef<View>(null);

    // fake a QBO connection sync
    const openQBOsync = useCallback(() => {
        setIsSyncInProgress(true);
        setTimeout(() => setIsSyncInProgress(false), 5000);
        setPolicyIsConnectedToAccountingSystem(true);
    }, []);

    const connectionsMenuItems: MenuItemProps[] = useMemo(
        () => [
            {
                icon: Expensicons.QBORound,
                interactive: false,
                iconHeight: variables.iconSizeExtraLarge,
                iconWidth: variables.iconSizeExtraLarge,
                wrapperStyle: [styles.sectionMenuItemTopDescription],
                shouldShowRightComponent: true,
                title: translate('workspace.accounting.qbo'),
                rightComponent: (
                    <Button
                        onPress={openQBOsync}
                        style={[styles.pl2, styles.justifyContentCenter]}
                        text={translate('workspace.accounting.setup')}
                        small
                    />
                ),
            },
            {
                icon: Expensicons.XeroRound,
                interactive: false,
                disabled: true,
                iconHeight: variables.iconSizeExtraLarge,
                iconWidth: variables.iconSizeExtraLarge,
                wrapperStyle: [styles.sectionMenuItemTopDescription],
                shouldShowRightComponent: true,
                title: translate('workspace.accounting.xero'),
                rightComponent: (
                    <Button
                        style={[styles.pl2, styles.justifyContentCenter]}
                        text={translate('workspace.accounting.setup')}
                        small
                        isDisabled
                    />
                ),
            },
        ],
        [openQBOsync, styles.pl2, styles.justifyContentCenter, styles.sectionMenuItemTopDescription, translate],
    );

    const qboConnectionMenuItems: MenuItemProps[] = useMemo(
        () =>
            isSyncInProgress
                ? []
                : [
                      {
                          icon: Expensicons.Pencil,
                          iconRight: Expensicons.ArrowRight,
                          shouldShowRightIcon: true,
                          title: translate('workspace.accounting.import'),
                          wrapperStyle: [styles.sectionMenuItemTopDescription],
                      },
                      {
                          icon: Expensicons.Send,
                          iconRight: Expensicons.ArrowRight,
                          shouldShowRightIcon: true,
                          title: translate('workspace.accounting.export'),
                          wrapperStyle: [styles.sectionMenuItemTopDescription],
                      },
                      {
                          icon: Expensicons.Gear,
                          iconRight: Expensicons.ArrowRight,
                          shouldShowRightIcon: true,
                          title: translate('workspace.accounting.advanced'),
                          wrapperStyle: [styles.sectionMenuItemTopDescription],
                      },
                  ],
        [isSyncInProgress, styles.sectionMenuItemTopDescription, translate],
    );

    const otherConnectionMenuItems: MenuItemProps[] = useMemo(
        () => [
            {
                key: 'workspace.accounting.other',
                iconRight: Expensicons.DownArrow,
                shouldShowRightIcon: true,
                description: translate('workspace.accounting.other'),
                wrapperStyle: [styles.sectionMenuItemTopDescription],
            },
        ],
        [styles.sectionMenuItemTopDescription, translate],
    );

    const threeDotsMenuItems: ThreeDotsMenuProps['menuItems'] = [
        {
            icon: Expensicons.Sync,
            text: translate('workspace.accounting.syncNow'),
            onSelected: () => {},
        },
        {
            icon: Expensicons.Trashcan,
            text: translate('workspace.accounting.disconnect'),
            onSelected: () => setIsDisconnectModalOpen(true),
        },
    ];

    const headerThreeDotsMenuItems: ThreeDotsMenuProps['menuItems'] = [
        {
            icon: Expensicons.Key,
            shouldShowRightIcon: true,
            iconRight: Expensicons.NewWindow,
            text: translate('workspace.accounting.enterCredentials'),
            onSelected: () => {},
        },
        {
            icon: Expensicons.Trashcan,
            text: translate('workspace.accounting.disconnect'),
            onSelected: () => setIsDisconnectModalOpen(true),
        },
    ];

    return (
        <ScreenWrapper
            testID={WorkspaceAccountingPage.displayName}
            includeSafeAreaPaddingBottom={false}
            shouldShowOfflineIndicatorInWideScreen
        >
            <HeaderWithBackButton
                title={translate('workspace.common.accounting')}
                shouldShowBackButton={isSmallScreenWidth}
                icon={Illustrations.Accounting}
                shouldShowThreeDotsButton
                threeDotsAnchorPosition={styles.threeDotsPopoverOffsetNoCloseButton(windowWidth)}
                threeDotsMenuItems={headerThreeDotsMenuItems}
            />
            <ScrollView contentContainerStyle={styles.pt3}>
                <View style={[styles.flex1, isSmallScreenWidth ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Section
                        title={translate('workspace.accounting.title')}
                        subtitle={translate('workspace.accounting.subtitle')}
                        isCentralPane
                        subtitleMuted
                        titleStyles={styles.accountSettingsSectionTitle}
                        childrenStyles={styles.pt5}
                    >
                        {policyIsConnectedToAccountingSystem && (
                            <View
                                ref={threeDotsMenuContainerRef}
                                style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween]}
                            >
                                <MenuItem
                                    title={translate('workspace.accounting.qbo')}
                                    description={translate(isSyncInProgress ? 'workspace.accounting.importing' : 'workspace.accounting.lastSync')}
                                    icon={Expensicons.QBORound}
                                    iconHeight={variables.avatarSizeNormal}
                                    iconWidth={variables.avatarSizeNormal}
                                    wrapperStyle={styles.sectionMenuItemTopDescription}
                                    interactive={false}
                                />
                                {isSyncInProgress ? (
                                    <ActivityIndicator
                                        style={[styles.popoverMenuIcon]}
                                        color={theme.spinner}
                                    />
                                ) : (
                                    <ThreeDotsMenu
                                        onIconPress={() => {
                                            threeDotsMenuContainerRef.current?.measureInWindow((x, y, width, height) => {
                                                setThreeDotsMenuPosition({
                                                    horizontal: x + width,
                                                    vertical: y + height,
                                                });
                                            });
                                        }}
                                        menuItems={threeDotsMenuItems}
                                        anchorPosition={threeDotsMenuPosition}
                                        anchorAlignment={{horizontal: CONST.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT, vertical: CONST.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP}}
                                    />
                                )}
                            </View>
                        )}
                        <MenuItemList
                            menuItems={policyIsConnectedToAccountingSystem ? [...qboConnectionMenuItems, ...otherConnectionMenuItems] : connectionsMenuItems}
                            shouldUseSingleExecution
                        />
                    </Section>
                </View>
            </ScrollView>
            <ConfirmModal
                title={translate('workspace.accounting.disconnectTitle')}
                isVisible={isDisconnectModalOpen}
                onConfirm={() => {}}
                onCancel={() => setIsDisconnectModalOpen(false)}
                prompt={translate('workspace.accounting.disconnectPrompt')}
                confirmText={translate('workspace.accounting.disconnect')}
                cancelText={translate('common.cancel')}
                danger
            />
        </ScreenWrapper>
    );
}

WorkspaceAccountingPage.displayName = 'WorkspaceAccountingPage';

export default WorkspaceAccountingPage;
