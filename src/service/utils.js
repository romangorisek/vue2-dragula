const raf = window.requestAnimationFrame
export const waitForTransition = raf
  ? function (fn) {
    raf(() => {
      raf(fn)
    })
  }
  : function (fn) {
    window.setTimeout(fn, 50)
  }
