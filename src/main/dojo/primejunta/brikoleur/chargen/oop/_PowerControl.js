define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/dom-class",
        "../data/stunts",
        "./_base/_FeatureControlBase",
        "dojo/text!./templates/_PowerControl.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domClass,
          stunts,
          _FeatureControlBase,
          template,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        data : stunts,
        selectedFeaturesTopic : "/SelectedStunts/",
        featureSelectedTopic : "/StuntSelected/",
        propertyPresentWarning : i18n.TrainingPresent,
        templateString : template
    });
});