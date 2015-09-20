define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "../../data/knacks",
        "./../_base/_FeatureControlBase",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          knacks,
          _FeatureControlBase,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        data : knacks,
        selectedFeaturesTopic : "/SelectedKnacks/",
        featureAddedTopic : "/TrainingAdded/",
        propertyPresentWarning : i18n.TrainingPresent
    });
});