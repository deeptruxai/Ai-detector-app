import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import type { MainTabParamList, RootStackParamList } from './types';

type RouteName = keyof RootStackParamList;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const isNavigationReady = () => navigationRef.isReady();

/**
 * Navigate to a screen in the root stack.
 * @example
 * navigateTo('Login');
 * navigateTo('VerifyOTP', { phoneNumber: '+15551234567' });
 */
export const navigateTo = <T extends RouteName>(
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  if (!isNavigationReady()) {
    return;
  }

  (navigationRef.navigate as (...args: unknown[]) => void)(screen, params);
};

/**
 * Reset the navigation state and set a new root screen.
 * @example
 * resetNavigation('Home');
 * resetNavigation('ScanningStatus', { mode: 'image' });
 */
export const resetNavigation = <T extends RouteName>(
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  if (!isNavigationReady()) {
    return;
  }

  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screen, params }],
    }),
  );
};

/**
 * Pop stack screens until the target screen is focused.
 * @example
 * popToScreen('Home');
 * popToScreen('ScanningStatus', { mode: 'text' });
 */
export const popToScreen = <T extends RouteName>(
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  if (!isNavigationReady()) {
    return;
  }

  navigationRef.dispatch(StackActions.popTo(screen, params));
};

/**
 * Pop all stack screens and go back to the first screen.
 * @example
 * popToTop();
 */
export const popToTop = () => {
  if (!isNavigationReady()) {
    return;
  }

  navigationRef.dispatch(StackActions.popToTop());
};

/**
 * Go back to the previous screen when possible.
 * @example
 * goBack();
 */
export const goBack = () => {
  if (!isNavigationReady() || !navigationRef.canGoBack()) {
    return;
  }

  navigationRef.goBack();
};

/**
 * After sign-in, land on the main tab bar with a specific tab selected.
 */
export const resetToMainTab = (tab: keyof MainTabParamList) => {
  if (!isNavigationReady()) {
    return;
  }

  navigationRef.dispatch(
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
export const navigateToMainTab = (tab: keyof MainTabParamList) => {
  navigateTo('Main', { screen: tab });
};

/**
 * Replace the current stack screen (same as navigation.replace on the root stack).
 */
export const replaceTo = <T extends RouteName>(
  screen: T,
  ...[params]: undefined extends RootStackParamList[T]
    ? [params?: RootStackParamList[T]]
    : [params: RootStackParamList[T]]
) => {
  if (!isNavigationReady()) {
    return;
  }

  navigationRef.dispatch(StackActions.replace(screen, params as object));
};
