import {
  CommonActions,
  createNavigationContainerRef,
  type NavigationProp,
  StackActions,
} from '@react-navigation/native';
import type { MainTabParamList, RootStackParamList } from './types';
import { RootStackScreens } from './types';

type RouteName = keyof RootStackParamList;

/** Use with `useNavigation` (stack or tab-under-root). */
export type RootStackNavigation = NavigationProp<RootStackParamList>;

const ROOT_STACK_ROUTE_SET = new Set<string>(
  Object.values(RootStackScreens) as string[],
);

/** Routes that must not be opened without explicit params (validated server-side for PN payloads). */
const ROUTES_REQUIRING_PARAMS: RouteName[] = [
  'VerifyOTP',
  'WebView',
  'ScanningStatus',
];

/**
 * Root container ref — use only when there is no `navigation` (e.g. FCM handlers).
 * @see navigateFromNotificationPayload
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigate from push notification `data` when the app has no screen `navigation` object.
 * Expects `data.screen` to match a root route; optional `data.params` as a JSON object string.
 */
export const navigateFromNotificationPayload = (
  data: Record<string, unknown> | undefined,
): void => {
  if (!data || !navigationRef.isReady()) {
    return;
  }

  const screenKey = data.screen;
  if (typeof screenKey !== 'string' || !ROOT_STACK_ROUTE_SET.has(screenKey)) {
    return;
  }

  const screen = screenKey as RouteName;

  const paramsJson = data.params;
  if (typeof paramsJson === 'string' && paramsJson !== '') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(paramsJson);
    } catch {
      return;
    }
    if (parsed === null || typeof parsed !== 'object') {
      return;
    }
    (navigationRef.navigate as (name: string, p: object) => void)(
      screen,
      parsed as object,
    );
    return;
  }

  if (ROUTES_REQUIRING_PARAMS.includes(screen)) {
    return;
  }

  (navigationRef.navigate as (...args: unknown[]) => void)(screen);
};

/**
 * Navigate to a screen on the root stack.
 */
export const navigateTo = <T extends RouteName>(
  navigation: RootStackNavigation,
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  (navigation.navigate as (...args: unknown[]) => void)(screen, params);
};

/**
 * Reset the navigation state and set a new root screen.
 */
export const resetNavigation = <T extends RouteName>(
  navigation: RootStackNavigation,
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screen, params }],
    }),
  );
};

/**
 * Pop stack screens until the target screen is focused.
 */
export const popToScreen = <T extends RouteName>(
  navigation: RootStackNavigation,
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  navigation.dispatch(StackActions.popTo(screen, params));
};

export const popToTop = (navigation: RootStackNavigation) => {
  navigation.dispatch(StackActions.popToTop());
};

export const goBack = (navigation: RootStackNavigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};

/**
 * After sign-in, land on the main tab bar with a specific tab selected.
 */
export const resetToMainTab = (
  navigation: RootStackNavigation,
  tab: keyof MainTabParamList,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          state: {
            routes: [{ name: tab }],
            index: 0,
          },
        },
      ],
    }),
  );
};

/**
 * Switch the Main tab navigator to a specific tab without resetting the whole stack.
 */
export const navigateToMainTab = (
  navigation: RootStackNavigation,
  tab: keyof MainTabParamList,
) => {
  navigateTo(navigation, 'Main', { screen: tab });
};

/**
 * Replace the current stack screen (root stack).
 */
export const replaceTo = <T extends RouteName>(
  navigation: RootStackNavigation,
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  navigation.dispatch(StackActions.replace(screen, params as object));
};
