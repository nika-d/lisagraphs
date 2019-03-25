export function check(data, DOMelementId, referenceObject){

    const checkMood = (obj) => (obj.hasOwnProperty('v') && obj.hasOwnProperty('a'));

    if (Array.isArray(referenceObject)) {
        if (! Array.isArray(data))
            throw  ('Wrong data structure for chart with id ' + DOMelementId + ' (not an array).');
        else if (! data.length > 0)
            throw  ('Empty data for chart with id ' + DOMelementId);
        else
            check(data[0], DOMelementId, referenceObject[0]);
    }
    else {
        const propNames = Object.getOwnPropertyNames(referenceObject);

        propNames.forEach( (prop) => {
            if (!data.hasOwnProperty(prop))
                throw  ('Wrong data structure for chart with id ' + DOMelementId + ' (' + prop + ' missing).');

            if (prop === 'mood' && !checkMood(data[prop]))
                throw  ('Wrong data structure for chart with id ' + DOMelementId + ' (wrong mood format).');

            else if (referenceObject[prop]){
                if ( ! (typeof referenceObject[prop] === typeof data[prop]) ||
                    ! (referenceObject[prop].constructor === data[prop].constructor) )
                    throw  ('Wrong data structure for chart with id ' + DOMelementId + ' (' + prop + ' is not an object).');
                else
                    check(data[prop], DOMelementId, referenceObject[prop]);
            }
        });
    }
}