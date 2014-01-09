// ---------------------------------------------------------------------------------------------------------------------
// Small collection of useful filters.
//
// @module utils.filters.js
// ---------------------------------------------------------------------------------------------------------------------

function simpleHash(s)
{
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
} // end hash

// ---------------------------------------------------------------------------------------------------------------------
// Capitalize filter
// ---------------------------------------------------------------------------------------------------------------------

module.filter('capitalize', function()
{
    return function capitalize(input)
    {
        if (input != null)
        {
            return input.substring(0,1).toUpperCase() + input.substring(1);
        } // end if

        return '';
    }; // end capitalize
});

// ---------------------------------------------------------------------------------------------------------------------
// Markdown filter (Note: Must be used with ng-bind!)
// ---------------------------------------------------------------------------------------------------------------------

module.filter('markdown', function($rootScope, $sce)
{
    //TODO: Should use an LRU cache instead!
    if(!$rootScope.markdownCache)
    {
        $rootScope.markdownCache = {};
    } // end if

    return function markdown(text, skipCache)
    {
        if(text)
        {
            if(!skipCache)
            {
                var hash = simpleHash(text);

                if(hash in $rootScope.markdownCache)
                {
                    return $sce.trustAsHtml($rootScope.markdownCache[hash]);
                } // end if
            } // end if

            var mdown = marked(text);

            // Support leading newlines.
            text.replace(/^(\r?\n)+/, function(match)
            {
                mdown = match.split(/\r?\n/).join("<br>") + mdown;
            });

            if(!skipCache)
            {
                $rootScope.markdownCache[hash] = mdown;
            } // end if

            return $sce.trustAsHtml(mdown);
        } // end if
    }; // end markdown
});

// ---------------------------------------------------------------------------------------------------------------------
// Reverse Filter
// ---------------------------------------------------------------------------------------------------------------------

module.filter('reverse', function() {
    return function(items) {
        if (!angular.isArray(items)) return false;
        return items.slice().reverse();
    };
});

// ---------------------------------------------------------------------------------------------------------------------