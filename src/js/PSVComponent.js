/**
 * Base sub-component class
 * @param psv (PhotoSphereViewer) A PhotoSphereViewer object
 * @param parent (PhotoSphereViewer | PSVComponent) The parent with a "container" property
 */
function PSVComponent(psv, parent) {
  this.psv = psv;
  this.parent = parent || psv;
  this.container = null;

  // expose some methods to the viewer
  if (this.constructor.publicMethods) {
    this.constructor.publicMethods.forEach(function(method) {
      this.psv[method] = this[method].bind(this);
    }, this);
  }
}

/**
 * Creates the component
 */
PSVComponent.prototype.create = function() {
  this.container = document.createElement('div');

  this.parent.container.appendChild(this.container);
};

/**
 * Destroys the component
 */
PSVComponent.prototype.destroy = function() {
  this.parent.container.removeChild(this.container);

  this.container = null;
  this.psv = null;
  this.parent = null;
};
