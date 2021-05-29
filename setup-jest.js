import $ from 'jquery';
import Modal from 'bootstrap'

global.$ = global.jQuery = $;
global.$.fn.modal = jest.fn(Modal)

