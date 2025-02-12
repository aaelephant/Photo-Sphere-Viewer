import { EVENTS, KEY_CODES } from '../data/constants';
import { getEventKey } from '../utils';
import { AbstractComponent } from './AbstractComponent';
import { PSVError } from '../PSVError';

/**
 * @summary Overlay component
 * @extends PSV.components.AbstractComponent
 * @memberof PSV.components
 */
export class Overlay extends AbstractComponent {

  /**
   * @param {PSV.Viewer} psv
   */
  constructor(psv) {
    super(psv, 'psv-overlay');

    /**
     * @override
     * @property {string} contentId
     * @property {boolean} dissmisable
     */
    this.prop = {
      ...this.prop,
      contentId  : undefined,
      dissmisable: true,
    };

    /**
     * Image container
     * @member {HTMLElement}
     * @readonly
     * @private
     */
    this.image = document.createElement('div');
    this.image.className = 'psv-overlay-image';
    this.container.appendChild(this.image);

    /**
     * Text container
     * @member {HTMLElement}
     * @readonly
     * @private
     */
    this.text = document.createElement('div');
    this.text.className = 'psv-overlay-text';
    this.container.appendChild(this.text);

    /**
     * Subtext container
     * @member {HTMLElement}
     * @readonly
     * @private
     */
    this.subtext = document.createElement('div');
    this.subtext.className = 'psv-overlay-subtext';
    this.container.appendChild(this.subtext);

    this.container.addEventListener('mouseup', this);

    document.addEventListener('keydown', this);

    super.hide();
  }

  /**
   * @override
   */
  destroy() {
    document.removeEventListener('keydown', this);

    delete this.image;
    delete this.text;
    delete this.subtext;

    super.destroy();
  }

  /**
   * @summary Handles events
   * @param {Event} e
   * @private
   */
  handleEvent(e) {
    /* eslint-disable */
    switch (e.type) {
      // @formatter:off
      case 'mouseup':  this.prop.dissmisable && this.hide(); break;
      case 'keydown':  getEventKey(e) === KEY_CODES.Escape && this.prop.dissmisable && this.hide(); break;
      // @formatter:on
    }
    /* eslint-enable */
  }

  /**
   * @override
   * @param {string} [id]
   */
  isVisible(id) {
    return this.prop.visible && (!id || !this.prop.contentId || this.prop.contentId === id);
  }

  /**
   * @override
   * @summary This method is not supported
   * @throws {PSV.PSVError} always
   */
  toggle() {
    throw new PSVError('Overlay cannot be toggled');
  }

  /**
   * @summary Displays an overlay on the viewer
   * @param {Object|string} config
   * @param {string} [config.id] - unique identifier to use with "hide"
   * @param {string} config.image - SVG image/icon displayed above the text
   * @param {string} config.text - main message
   * @param {string} [config.subtext] - secondary message
   * @param {boolean} [config.dissmisable=true] - if the user can hide the overlay by clicking
   * @fires PSV.show-overlay
   */
  show(config) {
    if (typeof config === 'string') {
      config = { text: config };
    }

    this.prop.contentId = config.id;
    this.prop.dissmisable = config.dissmisable !== false;
    this.image.innerHTML = config.image || '';
    this.text.innerHTML = config.text || '';
    this.subtext.innerHTML = config.subtext || '';

    super.show();

    this.psv.trigger(EVENTS.SHOW_OVERLAY, config.id);
  }

  /**
   * @summary Hides the overlay
   * @param {string} [id]
   * @fires PSV.hide-overlay
   */
  hide(id) {
    if (this.isVisible() && (!id || !this.prop.contentId || this.prop.contentId === id)) {
      const contentId = this.prop.contentId;

      super.hide();

      this.prop.contentId = undefined;

      this.psv.trigger(EVENTS.HIDE_OVERLAY, contentId);
    }
  }

}
