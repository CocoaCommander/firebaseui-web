/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tests for the provider match by email page.
 */

goog.provide('firebaseui.auth.ui.page.ProviderMatchByEmailTest');
goog.setTestOnly('firebaseui.auth.ui.page.ProviderMatchByEmailTest');

goog.require('firebaseui.auth.ui.element');
goog.require('firebaseui.auth.ui.element.EmailTestHelper');
goog.require('firebaseui.auth.ui.element.InfoBarTestHelper');
goog.require('firebaseui.auth.ui.element.TosPpTestHelper');
goog.require('firebaseui.auth.ui.page.PageTestHelper');
goog.require('firebaseui.auth.ui.page.ProviderMatchByEmail');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.KeyCodes');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.events');
goog.require('goog.testing.jsunit');
goog.require('goog.userAgent');


var mockClock;
var root;
var component;
var tosCallback;
var privacyPolicyCallback;
var emailTestHelper =
    new firebaseui.auth.ui.element.EmailTestHelper().registerTests();
var infoBarTestHelper =
    new firebaseui.auth.ui.element.InfoBarTestHelper().registerTests();
var tosPpTestHelper =
    new firebaseui.auth.ui.element.TosPpTestHelper().registerTests();
var pageTestHelper =
    new firebaseui.auth.ui.page.PageTestHelper().registerTests();


function setUp() {
  // Set up clock.
  mockClock = new goog.testing.MockClock();
  mockClock.install();
  tosCallback = goog.bind(
      firebaseui.auth.ui.element.TosPpTestHelper.prototype.onTosLinkClick,
      tosPpTestHelper);
  privacyPolicyCallback = goog.bind(
      firebaseui.auth.ui.element.TosPpTestHelper.prototype.onPpLinkClick,
      tosPpTestHelper);
  root = goog.dom.createDom(goog.dom.TagName.DIV);
  document.body.appendChild(root);
  component = new firebaseui.auth.ui.page.ProviderMatchByEmail(
      goog.bind(
          firebaseui.auth.ui.element.EmailTestHelper.prototype.onEnter,
          emailTestHelper),
      tosCallback,
      privacyPolicyCallback);
  component.render(root);
  emailTestHelper.setComponent(component);
  infoBarTestHelper.setComponent(component);
  tosPpTestHelper.setComponent(component);
  // Reset previous state of tosPp helper.
  tosPpTestHelper.resetState();
  pageTestHelper.setClock(mockClock).setComponent(component);
}


function tearDown() {
  pageTestHelper.tearDown();
}


function testInitialFocus() {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    return;
  }
  assertEquals(
      component.getEmailElement(),
      goog.dom.getActiveElement(document));
}


function testEmail_onEnter() {
  emailTestHelper.resetState();
  assertFalse(emailTestHelper.enterPressed_);
  goog.testing.events.fireKeySequence(
      component.getEmailElement(), goog.events.KeyCodes.ENTER);
  assertTrue(emailTestHelper.enterPressed_);
}


function testNextButton_onClick() {
  emailTestHelper.resetState();
  assertFalse(emailTestHelper.enterPressed_);
  goog.testing.events.fireClickSequence(component.getSubmitElement());
  assertTrue(emailTestHelper.enterPressed_);
}


function testProviderMatchByEmail_fullMessage() {
  tosPpTestHelper.assertFullMessage(tosCallback, privacyPolicyCallback);
}


function testProviderMatchByEmail_noTosPp() {
  component.dispose();
  component = new firebaseui.auth.ui.page.ProviderMatchByEmail(
      goog.bind(
          firebaseui.auth.ui.element.EmailTestHelper.prototype.onEnter,
          emailTestHelper));
  component.render(root);
  tosPpTestHelper.setComponent(component);
  tosPpTestHelper.assertFullMessage(null, null);
}


function testProviderMatchByEmail_pageEvents() {
  // Run page event tests.
  // Dispose previously created container since test must run before rendering
  // the component in docoument.
  component.dispose();
  // Initialize component.
  component = new firebaseui.auth.ui.page.ProviderMatchByEmail(
      goog.bind(
          firebaseui.auth.ui.element.EmailTestHelper.prototype.onEnter,
          emailTestHelper));
  // Run all page helper tests.
  pageTestHelper.runTests(component, root);
}


function testProviderMatchByEmail_getPageId() {
  assertEquals('providerMatchByEmail', component.getPageId());
}
