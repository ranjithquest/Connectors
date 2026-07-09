'use client';

import React, { useState } from 'react';
import { PrimaryButton, ActionButton, DefaultButton, Dialog, DialogType, DialogFooter, TextField, Dropdown, ChoiceGroup, Toggle, Checkbox as FluentV8Checkbox, NormalPeoplePicker, Pivot, PivotItem, AnimationStyles } from '@fluentui/react';
import { mergeStyles } from '@fluentui/merge-styles';

const slideInClass = mergeStyles(AnimationStyles.slideDownIn10);
import type { IDropdownOption, IChoiceGroupOption, IPersonaProps } from '@fluentui/react';
import type { Connector, AuthMethod, UserCriteriaType, DiagnosticIssue, IssueSource, SyncEvent, RecommendedAction } from '@/lib/types';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import SetupGuideRail, { type GuideSection } from './SetupGuideRail';
import {
  ChromeCloseIcon, EditIcon,
  ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, CheckMarkIcon, InfoIcon, BackIcon,
  OpenInNewWindowIcon, NavigateBackIcon, DiagnosticIcon,
  StatusCircleCheckmarkIcon, ErrorBadgeIcon, StatusCircleSyncIcon,
  WarningSolidIcon, AlertSolidIcon,
  AddIcon, UploadIcon, RefreshIcon,
} from '@fluentui/react-icons-mdl2';
import {
  Card,
  CardHeader,
  CardFooter,
  Badge,
  Button,
  ToggleButton,
  Text,
  ProgressBar,
  Checkbox,
  MessageBar,
  MessageBarBody,
  tokens,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  useTableFeatures,
  createTableColumn,
  useTableSelection,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components';
import { OverlayDrawer, DrawerBody } from '@fluentui/react-drawer';

