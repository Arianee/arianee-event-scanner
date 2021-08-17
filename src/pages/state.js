export const STATES=Object.freeze({
    loading:'loading',
    unvalid:'unvalid',
    valid:'valid',
    none:'none'
});

export const ErrorCodeMessage=Object.freeze({
    none:'waiting for scan',
    linkUnvalid:'Qr code link is not Arianee link',
    notFromBrand:'Passport is not from this Brand',
    tooOld:'Proof is too old',
    unknown:'unknown'
});
