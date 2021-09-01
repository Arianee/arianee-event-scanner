export const STATES=Object.freeze({
    loading:'loading',
    unvalid:'unvalid',
    valid:'valid',
    none:'none'
});

export const ErrorCodeMessage=Object.freeze({
    none:'waiting for scan',
    loading:'loading',
    success:'Success !',
    linkUnvalid:'Qr code link is not Arianee link',
    notFromBrand:'Passport is not from this Brand',
    tooOld:'Proof is too old',
    notGoodCertificate:'Passport is not in list',
    unknown:'unknown'
});
