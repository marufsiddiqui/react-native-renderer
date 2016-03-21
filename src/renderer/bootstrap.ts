//React Native wrapper
import {ReactNativeWrapper} from "./../wrapper/wrapper";
import {ReactNativeWrapperImpl} from './../wrapper/wrapper_impl';

//Dependencies
import 'reflect-metadata';
  // Zone.js
import {Zone} from 'zone.js/build/lib/core';
global.Zone = Zone;
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/build/lib/patch/functions';
import {apply} from 'zone.js/build/lib/patch/promise';
patchSetClearFunction(global, global.Zone,
  [['setTimeout', 'clearTimeout', false, false],
  ['setInterval', 'clearInterval', true, false],
  ['setImmediate', 'clearImmediate', false, false]]);

//Needed for Android or iOS, but to be imported after zone.js, and
var originalIsExtensible = Object.isExtensible;
import 'es6-shim';
Object.isExtensible = originalIsExtensible;
//Patch promises after es6-shim overrides them
apply();

// Finally, define the bootstrap
import {RootRenderer, Renderer, provide, NgZone, Provider, enableProdMode, PLATFORM_DIRECTIVES} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from './renderer';

import {View} from "./../components/view";
import {Text} from "../components/text";
import {Switch} from "../components/switch";
import {TextInput} from "../components/textinput";
import {WebView} from "../components/webview";
import {ProgressBar} from "../components/android/progress_bar";
import {PagerLayout} from "../components/android/pager_layout";
import {DrawerLayout, DrawerLayoutSide, DrawerLayoutContent} from "../components/android/drawer_layout";
import {RefreshControl} from "../components/refresh_control";
import {Toolbar} from "../components/android/toolbar";
import {Image} from '../components/image';
import {ScrollView} from "../components/scrollview";
import {Picker} from "../components/picker";
import {ActivityIndicator} from '../components/ios/activity_indicator';
import {ProgressView} from "../components/ios/progress_view";
import {SegmentedControl} from "../components/ios/segmented_control";
import {Slider} from "../components/ios/slider";
import {DatePicker} from "../components/ios/date_picker";
import {MapView} from "../components/ios/map_view";
import {TabBar} from "../components/ios/tabbar";
import {TabBarItem} from "../components/ios/tabbar_item";

export function bootstrapReactNative(appName:string, cpt: any, customProviders?: Array<any> = []) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    bootstrap(cpt, [
      //Common components
      provide(PLATFORM_DIRECTIVES, {useValue: [Image], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [Picker], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [RefreshControl], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [ScrollView], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [Switch], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [Text], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [TextInput], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [View], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [WebView], multi:true}),
      //Android components
      provide(PLATFORM_DIRECTIVES, {useValue: [DrawerLayout], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [DrawerLayoutSide], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [DrawerLayoutContent], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [PagerLayout], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [ProgressBar], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [Toolbar], multi:true}),
      //iOS components
      provide(PLATFORM_DIRECTIVES, {useValue: [ActivityIndicator], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [DatePicker], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [MapView], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [ProgressView], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [SegmentedControl], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [Slider], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [TabBar], multi:true}),
      provide(PLATFORM_DIRECTIVES, {useValue: [TabBarItem], multi:true}),
      //Others
      [ReactNativeWrapperImpl],
      provide(REACT_NATIVE_WRAPPER, {useExisting: ReactNativeWrapperImpl}),
      [ReactNativeElementSchemaRegistry],
      provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
      provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
      provide(RootRenderer, {useExisting: ReactNativeRootRenderer})
    ].concat(customProviders)).then(function(appRef) {
      var zone = appRef.injector.get(NgZone);
      var rootRenderer = appRef.injector.get(RootRenderer);
      zone.onTurnDone.subscribe(() => { rootRenderer.executeCommands(); });
      appRef.injector.get(ReactNativeWrapperImpl).patchReactUpdates(zone._innerZone);
    });
  });
}