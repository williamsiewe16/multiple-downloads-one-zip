"use strict";
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
exports.__esModule = true;
var axios = require('axios');
var fs = require('fs');
var util = require('util');
var childProcess = require('child_process');
var events = require('events');
module.exports = {
    downloadAndZip: function (urls, options) { return __awaiter(void 0, void 0, void 0, function () {
        var dir_name, zip_dir, zip_path, files_Path, exec, emitter, count, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir_name = options.zip_name ? options.zip_name.split(' ').join('_') : new Date().getTime().toString(16);
                    zip_dir = options.zip_dir ? (options.zip_dir != "" ? options.zip_dir + "/" : "") : "", zip_path = "" + zip_dir + dir_name + ".zip";
                    files_Path = [];
                    exec = util.promisify(childProcess.exec);
                    emitter = new events.EventEmitter();
                    count = 0;
                    emitter.on('addAll', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var script1, script2, script3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    script1 = "rar a " + zip_path + " " + dir_name;
                                    return [4 /*yield*/, exec(script1)];
                                case 1:
                                    _a.sent();
                                    script2 = "del /q " + dir_name;
                                    script3 = "rmdir " + dir_name;
                                    return [4 /*yield*/, exec(script2)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, exec(script3)];
                                case 3:
                                    _a.sent();
                                    emitter.emit('end');
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    emitter.on('fileComplete', function (file_path) {
                        options.onFileComplete ? options.onFileComplete({ complete: true }) : "";
                    });
                    emitter.on('end', function () {
                        options.onEnd ? options.onEnd({ zip_path: zip_path }) : "";
                    });
                    _loop_1 = function (i) {
                        var url, extension, file_path, res, writer, download;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = urls[i], extension = options.file_extension || "jpg", file_path = dir_name + "/" + (i + 1) + "." + extension;
                                    return [4 /*yield*/, axios(url, { responseType: 'stream' })];
                                case 1:
                                    res = _a.sent();
                                    return [4 /*yield*/, fs.mkdir(dir_name, function () { })];
                                case 2:
                                    _a.sent();
                                    writer = fs.createWriteStream(file_path);
                                    download = res.data.pipe(writer);
                                    download.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            files_Path.push(file_path);
                                            count++;
                                            emitter.emit('fileComplete', file_path);
                                            if (count == urls.length)
                                                emitter.emit('addAll');
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < urls.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
