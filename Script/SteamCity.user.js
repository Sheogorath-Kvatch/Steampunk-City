// ==UserScript==
// @name         Steampunk City
// @namespace    http://tampermonkey.net/
// @version      1.0
// @downloadURL
// @updateURL
// @description  Replace town map and building-list images
// @match        *://*.illyriad.co.uk/*
// @match        *://elgea.illyriad.co.uk/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const BUILDING_SIZE = 70;
    const BUILDING_OFFSET = (75 - BUILDING_SIZE) / 2;
    const CASTLE = 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/steam%20castle.png';

    let mapOn = GM_getValue('mapOn', true);
    let buildingsOn = GM_getValue('buildingsOn', true);

    const SIZE_OVERRIDES = {
        '03-geomancersretreat_off.png': 65
    };

    const DEFAULT_BRIGHTNESS = 1.0;
    const DEFAULT_HUE = -15;
    const DEFAULT_SATURATION = 1.4;

    const BRIGHTNESS_OVERRIDES = {
        //'back.jpg': 1.0,
        //'lumberwood.png': 1.0,
        //'03-squarebushes.png': 1.0
    };

    const HUE_OVERRIDES = {
        //'back.jpg': 0,
        //'lumberwood.png': 0,
        //'03-squarebushes.png': 0
    };

    const SATURATION_OVERRIDES = {
        //'back.jpg': 1.0,
        //'lumberwood.png': 1.0,
        //'03-squarebushes.png': 1.0
    };

    const MAP_ONLY = {
        'back.jpg':                  'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%204/steamback.png',
        '03-roads.png':              '',
        '03-squarebushes.png':       '',
        '03-fountain.png':           '',
        '03-wall_upper.png':         'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%204/steampunk%20upper%20upper.png',
        '03-wall_lower.png':         'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%204/steampunk%20lower%20wall.png',
        'lumberwood.png':            '',
        '03-castle_off.png':         CASTLE,
        '03-lumberjack_off.png':     '',
        '03-claypit_off.png':        '',
        '03-ironmine_right_off.png': '',
        '03-ironmine_left_off.png':  '',
        '03-quarry_right_off.png':   '',
        '03-quarry_left_off.png':    '',
        '03-farm_1_off.png':         '',
        '03-farm_2_off.png':         '',
        '03-farm_3_off.png':         '',
        '03-farm_4_off.png':         '',
        '03-farm_5_off.png':         '',
        '03-farm_6_off.png':         '',
        '03-farm_7_off.png':         '',
        '03-farm_5_c_off.png':       '',
        'build.gif':                 'https://caccioppoli.com/gif%20animated%20icons/Hammering_in.gif'
    };

    const BUILDINGS = {
        '03-barracks_off.png':             'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/barracks.png',
        '03-warehouse_off.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/warehouse.png',
        '03-flourmill_off.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/flourmill.png',
        '03-library_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/library.png',
        '03-storehouse_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/storehouse.png',
        '03-marketplace_off.png':          'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/market.png',
        '03-paddock_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/paddock2.png',
        '03-magetower_off.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/mage%20tower.png',
        '03-commonground_off.png':         'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/commonground.png',
        '03-saddlemaker_off.png':          'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/saddlemaker.png',
        '03-consulate_off.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/consolate.png',
        '03-fletcher_off.png':             'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/fletcher.png',
        '03-blacksmith_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/blacksmith.png',
        '03-forge_off.png':                'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/forge.png',
        '03-spearmaker_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/spearmaker.png',
        '03-tanner_off.png':               'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/tannery.png',
        '03-farmyard_off.png':             '',
        '03-skinnersguild_off.png':        'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/trapper%20skinners%20guild.png',
        '03-archersfield_off.png':         'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/archersfield.png',
        '03-architectsoffice_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/architects%20office.png',
        '03-arcticwarfarecollege_off.png': 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/arctic%20collage.png',
        '03-assassinsabode_off.png':       'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/assassins%20abode.png',
        '03-bookbinder_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/book%20binder.png',
        '03-bowyer_off.png':               'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/bower.png',
        '03-brewery_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/brewery.png',
        '03-carpenter_off.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/carpenter.png',
        '03-cavalryparadeground_off.png':  'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/cavalry%20parade%20ground.png',
        '03-chainsmith_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/chainsmith.png',
        '03-chanceryofestates_off.png':    'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/chancery%20of%20estates.png',
        '03-cottage_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/cottage.png',
        '03-desertwarfarecollege_off.png': 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/desert%20warefare%20collage.png',
        '03-emptytownplotbuildlist_off.png': '',
        '03-foreignoffice_off.png':        'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/foreign%20office.png',
        '03-foundry_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/foundry.png',
        '03-geomancersretreat_off.png':    'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/geomancers%20retreat.png',
        '03-herbalist_off.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/herbalists%20guild.png',
        '03-horsetrainer2_off.png':        'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/horse%20trainer.png',
        '03-infantryquarters_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/infantry%20quarters.png',
        '03-junglewarfarecollege_off.png': 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/jungle%20collage.png',
        '03-kiln_off.png':                 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/kiln.png',
        '03-leathersmith_off.png':         'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/leathersmith.png',
        '03-merchantsguild_off.png':       'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/merchants%20guild.png',
        '03-miner_off.png':                'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/miners%20guild.png',
        '03-platesmith_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/platesmith.png',
        '03-runmastersgrounding_off.png':  'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/Rune%20Master%20grounding.png',
        '03-saboteurssanctuary_off.png':   'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/saboteurs%20sanctuary.png',
        '03-scoutslookout_off.png':        'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/scouts%20lookout.png',
        '03-siegeworkshop_off.png':        'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%204/siege%20workshop.png',
        '03-spearmensbillets_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/spearmans%20billets.png',
        '03-spearsmith_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/spearsmith.png',
        '03-spieshidout_off.png':          'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/spies%20hideout.png',
        '03-stonemason_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%204/stonemason.png',
        '03-swordsmith_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/swordsmith.png',
        '03-taverna_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/tavern.png',
        '03-thievesden_off.png':           'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/theives%20den.png',
        '03-tradeoffice_off.png':          'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%202/trade%20guild.png',
        '03-trapper_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk/trapper%20skinners%20guild.png',
        '03-vault_off.png':                'https://raw.githubusercontent.com/Sheogorath-Kvatch/Steampunk-City/refs/heads/main/Steampunk%203/vault.png'
    };

    const mapPairs = Object.entries(MAP_ONLY).filter(([, url]) => url);
    const buildingPairs = Object.entries(BUILDINGS).filter(([, url]) => url);

    function getSrc(img) {
        return img.dataset.originalSrc || img.getAttribute('src') || img.src || '';
    }

    function getOverride(map, src, fallback) {
        for (const [needle, value] of Object.entries(map)) {
            if (src.includes(needle)) return value;
        }
        return fallback;
    }

    function applyFilters(img) {
        const src = getSrc(img);
        const brightness = getOverride(BRIGHTNESS_OVERRIDES, src, DEFAULT_BRIGHTNESS);
        const hue = getOverride(HUE_OVERRIDES, src, DEFAULT_HUE);
        const saturation = getOverride(SATURATION_OVERRIDES, src, DEFAULT_SATURATION);

        const filters = ['brightness(' + brightness + ')'];
        if (saturation !== 1) filters.push('saturate(' + saturation + ')');
        if (hue) filters.push('hue-rotate(' + hue + 'deg)');
        img.style.filter = filters.join(' ');
    }

    function applyFiltersToAll() {
        document.querySelectorAll('#townMap img').forEach(applyFilters);
    }

    function shrinkBuilding(img, needle) {
        if (!needle.includes('_off.png')) return;
        if (needle.includes('wall_') || needle.includes('castle') || needle.includes('farm_')) return;
        const size = SIZE_OVERRIDES[needle] || BUILDING_SIZE;
        const offset = (75 - size) / 2;
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.objectFit = 'contain';
        img.style.marginLeft = offset + 'px';
        img.style.marginTop = offset + 'px';
    }

    function clearShrink(img) {
        img.style.width = '';
        img.style.height = '';
        img.style.objectFit = '';
        img.style.marginLeft = '';
        img.style.marginTop = '';
    }

    function restore(img, tag) {
        if (img.dataset.skinTag !== tag) return;
        if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
        delete img.dataset.skinned;
        delete img.dataset.skinTag;
        delete img.dataset.originalSrc;
        clearShrink(img);
        img.style.filter = '';
    }

function sizeBuildGif(img) {
    const size = 52;
    const original = 75;
    const offset = (original - size) / 2;

    img.style.width = size + 'px';
    img.style.height = size + 'px';
    img.style.objectFit = 'contain';

    img.style.marginLeft = (offset - -10) + 'px';
    img.style.marginTop = (offset - 15) + 'px';

}

    function swap(img, pairs, tag, allowShrink) {
        if (img.dataset.skinned && img.dataset.skinTag === tag) return;
        const src = img.dataset.originalSrc || img.getAttribute('src') || '';
        if (!src) return;
        for (const [needle, url] of pairs) {
            if (src.includes(needle)) {
                if (!img.dataset.originalSrc) img.dataset.originalSrc = img.getAttribute('src') || src;
                img.src = url;
                img.dataset.skinned = '1';
                img.dataset.skinTag = tag;
                if (needle === 'build.gif') {
                    sizeBuildGif(img);
                } else if (allowShrink) {
                    shrinkBuilding(img, needle);
                }
                return;
            }
        }
    }

    function capKeepCastle() {
        if (!mapOn || !CASTLE) return;
        document.querySelectorAll('img').forEach(img => {
            if (img.closest('#townMap')) return;
            const src = img.dataset.originalSrc || img.getAttribute('src') || img.src || '';
            if (!src.includes('03-castle_off.png')) return;
            if (img.dataset.skinTag !== 'map') {
                img.dataset.originalSrc = img.getAttribute('src') || src;
                img.src = CASTLE;
                img.dataset.skinned = '1';
                img.dataset.skinTag = 'map';
            }
            img.style.setProperty('width', '251px', 'important');
            img.style.setProperty('height', '169px', 'important');
            img.style.setProperty('max-width', '251px', 'important');
            img.style.setProperty('max-height', '169px', 'important');
            img.style.objectFit = 'contain';
        });
    }

    function apply() {
        document.querySelectorAll('img').forEach(img => {
            if (!mapOn && img.dataset.skinTag === 'map') restore(img, 'map');
            if (!buildingsOn && img.dataset.skinTag === 'building') restore(img, 'building');
        });
        if (mapOn) {
            document.querySelectorAll('#townMap img, img').forEach(img => swap(img, mapPairs, 'map', false));
            capKeepCastle();
        }
        if (buildingsOn) {
            document.querySelectorAll('img').forEach(img => swap(img, buildingPairs, 'building', true));
        }
        if (mapOn || buildingsOn) {
            applyFiltersToAll();
        }
    }

    function registerMenus() {
        GM_registerMenuCommand((mapOn ? 'City skin: ON' : 'City skin: OFF') + ' — click to toggle', () => {
            mapOn = !mapOn;
            GM_setValue('mapOn', mapOn);
            apply();
            location.reload();
        });
        GM_registerMenuCommand((buildingsOn ? 'Buildings: ON' : 'Buildings: OFF') + ' — click to toggle', () => {
            buildingsOn = !buildingsOn;
            GM_setValue('buildingsOn', buildingsOn);
            apply();
            location.reload();
        });
    }

    registerMenus();
    apply();
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    console.log('Town skin loaded. Map:', mapOn, 'Buildings:', buildingsOn);
})();