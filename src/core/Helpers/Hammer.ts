import '../MIT/hammer-v2.0.8.min.js'
let Hammer = globalThis.Hammer // @ts-ignore
delete globalThis?.Hammer
export default Hammer