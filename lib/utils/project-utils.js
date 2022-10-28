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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValidOptionFlag = exports.moveDefaultProjectToStart = exports.askForProjectName = exports.shouldGenerateFlat = exports.shouldGenerateSpec = exports.shouldAskForProject = void 0;
const inquirer = require("inquirer");
const get_value_or_default_1 = require("../compiler/helpers/get-value-or-default");
const questions_1 = require("../questions/questions");
function shouldAskForProject(schematic, configurationProjects, appName) {
    return (['app', 'sub-app', 'library', 'lib'].includes(schematic) === false &&
        configurationProjects &&
        Object.entries(configurationProjects).length !== 0 &&
        !appName);
}
exports.shouldAskForProject = shouldAskForProject;
function shouldGenerateSpec(configuration, schematic, appName, specValue, specPassedAsInput) {
    if (specPassedAsInput === true || specPassedAsInput === undefined) {
        // CLI parameters has the highest priority
        return specValue;
    }
    let specConfiguration = (0, get_value_or_default_1.getValueOrDefault)(configuration, 'generateOptions.spec', appName || '');
    if (typeof specConfiguration === 'boolean') {
        return specConfiguration;
    }
    if (typeof specConfiguration === 'object' &&
        specConfiguration[schematic] !== undefined) {
        return specConfiguration[schematic];
    }
    if (typeof specConfiguration === 'object' && appName) {
        // The appName has a generateOption spec, but not for the schematic trying to generate
        // Check if the global generateOptions has a spec to use instead
        specConfiguration = (0, get_value_or_default_1.getValueOrDefault)(configuration, 'generateOptions.spec', '');
        if (typeof specConfiguration === 'boolean') {
            return specConfiguration;
        }
        if (typeof specConfiguration === 'object' &&
            specConfiguration[schematic] !== undefined) {
            return specConfiguration[schematic];
        }
    }
    return specValue;
}
exports.shouldGenerateSpec = shouldGenerateSpec;
function shouldGenerateFlat(configuration, appName, flatValue) {
    // CLI parameters have the highest priority
    if (flatValue === true) {
        return flatValue;
    }
    const flatConfiguration = (0, get_value_or_default_1.getValueOrDefault)(configuration, 'generateOptions.flat', appName || '');
    if (typeof flatConfiguration === 'boolean') {
        return flatConfiguration;
    }
    return flatValue;
}
exports.shouldGenerateFlat = shouldGenerateFlat;
function askForProjectName(promptQuestion, projects) {
    return __awaiter(this, void 0, void 0, function* () {
        const questions = [
            (0, questions_1.generateSelect)('appName')(promptQuestion)(projects),
        ];
        const prompt = inquirer.createPromptModule();
        return prompt(questions);
    });
}
exports.askForProjectName = askForProjectName;
function moveDefaultProjectToStart(configuration, defaultProjectName, defaultLabel) {
    let projects = configuration.projects != null ? Object.keys(configuration.projects) : [];
    if (configuration.sourceRoot !== 'src') {
        projects = projects.filter((p) => p !== defaultProjectName.replace(defaultLabel, ''));
    }
    projects.unshift(defaultProjectName);
    return projects;
}
exports.moveDefaultProjectToStart = moveDefaultProjectToStart;
function hasValidOptionFlag(queriedOptionName, options, queriedValue = true) {
    return options.some((option) => option.name === queriedOptionName && option.value === queriedValue);
}
exports.hasValidOptionFlag = hasValidOptionFlag;