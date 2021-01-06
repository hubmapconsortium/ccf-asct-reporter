var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require("express");
var bodyParser = require("body-parser");
var axios = require("axios");
var cors = require("cors");
var path = require('path');
var papa = require('papaparse');
var fs = require('fs');
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
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
    }
    return Row;
}());
var headerMap = {
    'AS': 'anatomical_structures', 'CT': 'cell_types', 'BG': 'biomarkers', 'BP': 'biomarkers'
};
var ids = '0123456789';
app.get("/v2/:sheetid/:gid", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var f1, f2, rows, response, data, headerRow, dataLength, i, newRow, j, rowHeader, key, s, n, n, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                f1 = req.params.sheetid;
                f2 = req.params.gid;
                rows = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get("https://docs.google.com/spreadsheets/d/" + f1 + "/export?format=csv&gid=" + f2)];
            case 2:
                response = _a.sent();
                data = papa.parse(response.data).data;
                headerRow = 11;
                dataLength = data.length;
                for (i = headerRow; i < dataLength; i++) {
                    newRow = new Row();
                    for (j = 0; j < data[0].length; j++) {
                        if (data[i][j] === '')
                            continue;
                        rowHeader = data[headerRow - 1][j].split('/');
                        key = headerMap[rowHeader[0]];
                        if (rowHeader.length === 2 && Number(rowHeader[1])) {
                            s = new Structure(data[i][j]);
                            if (rowHeader[0] === 'BG')
                                s.b_type = BM_TYPE.G;
                            if (rowHeader[0] === 'BP')
                                s.b_type = BM_TYPE.P;
                            newRow[key].push(s);
                        }
                        if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
                            n = newRow[key][parseInt(rowHeader[1]) - 1];
                            if (n)
                                n.id = data[i][j];
                        }
                        else if (rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
                            n = newRow[key][parseInt(rowHeader[1]) - 1];
                            if (n)
                                n.rdfs_label = data[i][j];
                        }
                    }
                    console.log(newRow);
                    rows.push(newRow);
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.status(500).send({
                        msg: 'Please check the table format or the sheet access',
                        code: 500
                    })];
            case 4: return [2 /*return*/, res.send(rows)];
        }
    });
}); });
app.get("/", function (req, res) {
    res.sendFile('views/home.html', { root: __dirname });
});
app.get("/:sheetid/:gid", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var f1, f2, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                f1 = req.params.sheetid;
                f2 = req.params.gid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get("https://docs.google.com/spreadsheets/d/" + f1 + "/export?format=csv&gid=" + f2)];
            case 2:
                response = _a.sent();
                if (response.headers['content-type'] !== 'text/csv') {
                    res.statusMessage = 'Please check if the sheet has the right access';
                    res.status(500).end();
                    return [2 /*return*/];
                }
                if (response.status === 200) {
                    res.status(206).send(response.data);
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                res.statusMessage = err_2;
                res.status(500).end();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT || 5000);
