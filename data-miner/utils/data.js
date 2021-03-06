"use strict";
exports.__esModule = true;
exports.makeASCTBData = void 0;
var BM_TYPE;
(function (BM_TYPE) {
    BM_TYPE["G"] = "gene";
    BM_TYPE["P"] = "protein";
})(BM_TYPE || (BM_TYPE = {}));
var Structure = /** @class */ (function () {
    function Structure(name) {
        this.name = name;
        this.id = '';
        this.rdfs_label = '';
    }
    return Structure;
}());
var Row = /** @class */ (function () {
    function Row() {
        this.anatomical_structures = [];
        this.cell_types = [];
        this.biomarkers = [];
        this.references = [];
    }
    return Row;
}());
var headerMap = {
    'AS': 'anatomical_structures', 'CT': 'cell_types', 'BG': 'biomarkers', 'BP': 'biomarkers',
    'REF': 'references'
};
function makeASCTBData(data) {
    return new Promise(function (res, rej) {
        var rows = [];
        var headerRow = 11;
        var dataLength = data.length;
        try {
            for (var i = headerRow; i < dataLength; i++) {
                var newRow = new Row();
                for (var j = 0; j < data[0].length; j++) {
                    if (data[i][j] === '')
                        continue;
                    var rowHeader = data[headerRow - 1][j].split('/');
                    var key = headerMap[rowHeader[0]];
                    if (key === undefined)
                        continue;
                    if (rowHeader.length === 2 && Number(rowHeader[1])) {
                        if (rowHeader[0] === 'REF') {
                            var ref = { id: data[i][j] };
                            newRow[key].push(ref);
                        }
                        else {
                            var s = new Structure(data[i][j]);
                            if (rowHeader[0] === 'BG')
                                s.b_type = BM_TYPE.G;
                            if (rowHeader[0] === 'BP')
                                s.b_type = BM_TYPE.P;
                            newRow[key].push(s);
                        }
                    }
                    if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
                        var n = newRow[key][parseInt(rowHeader[1]) - 1];
                        if (n)
                            n.id = data[i][j];
                    }
                    else if (rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
                        var n = newRow[key][parseInt(rowHeader[1]) - 1];
                        if (n)
                            n.rdfs_label = data[i][j];
                    }
                    else if (rowHeader.length === 3 && rowHeader[2] === 'DOI') {
                        var n = newRow[key][parseInt(rowHeader[1]) - 1];
                        if (n)
                            n.doi = data[i][j];
                    }
                    else if (rowHeader.length === 3 && rowHeader[2] === 'NOTES') {
                        var n = newRow[key][parseInt(rowHeader[1]) - 1];
                        if (n)
                            n.notes = data[i][j];
                    }
                }
                rows.push(newRow);
            }
            res(rows);
        }
        catch (err) {
            rej(err);
        }
    });
}
exports.makeASCTBData = makeASCTBData;
