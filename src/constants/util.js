import React from 'react';
import { IconButton } from 'musiklernplattform-components';

import moment from 'moment';

export const plans = {
  NONE: 0,
  STUDENT: 1,
  TEACHER: 2,
  PARENT: 3,
  OFFICE: 4,
};

export const formatDate = (dateString) => moment(dateString).format('DD.MM.YYYY');

export const unfreeze = (value) => JSON.parse(JSON.stringify(value));

export const generateActionItem = (icon, enabled, label, onClickHandler) => (
  <IconButton
    icon={icon}
    style={{ justifyContent: 'center' }}
    disabled={!enabled || false}
    label={label}
    onClickHandler={() => onClickHandler()}
  />
);

export const libItemOptionsConstants = {
  ADD_FAVORITE: 0,
  REMOVE_FAVORITE: 1,
  OPEN_HELP: 7,
  OPEN_INFO: 8,
};

export const validationFunctions = {
  isRequiredFunc: (value) => ((value.length < 1) ? 'Dieses Feld wird benötigt.' : null),
  isRequiredYearFunc: (value) => ((value.match(/\d+/) && value.length === 4)
    ? null : 'Dieses Feld wird benötigt.'),
  isNotRequiredYearFunc: (value) => ((value.match(/\d+/) && value.length === 4) || value.length < 1
    ? null : 'Die Eingabe stimmt nicht.'),
};

export const Base64 = {

  // private property
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  // public method for encoding
  encode(input) {
    let output = '';
    let chr1; let chr2; let chr3; let enc1; let enc2; let enc3; let
      enc4;
    let i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output
          + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2)
          + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }

    return output;
  },

  // public method for decoding
  decode(input) {
    let output = '';
    let chr1; let chr2; let
      chr3;
    let enc1; let enc2; let enc3; let
      enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);

      if (enc3 != 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output += String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode(string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode(utftext) {
    let string = '';
    let i = 0;
    let c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }

    return string;
  },

};

export const getComposerOrInterpreterName = (element) => {
  switch (element.playerType) {
    case 'Korrepetition': {
      if (element.metaData.composer) {
        return `${
          element.metaData.composer.firstname} ${element.metaData.composer.lastname}`;
      }
      return '';
    }
    case 'Ensemble_Band': {
      if (element.metaData.interpreter) return element.metaData.interpreter.name;
      return '';
    }
    default: {
      return '';
    }
  }
};

export const getFilePath = (name, libElement) => {
  if (!name) return null;

  return `${
    process.env.FILE_SERVER_BASE_URL}${libElement.productionNo.replace(/-/g, '_')}/${name}`;
};

export default {
  plans,
  generateActionItem,
  libItemOptionsConstants,
  validationFunctions,
  Base64,
  getComposerOrInterpreterName,
  getFilePath,
};
