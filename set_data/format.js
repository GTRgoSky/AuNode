var $ = require('../common');

module.exports = {
    // 主任务表
    TourismMission: function(v){
        var _obj = {};
        _obj.TMId = v[0];
        _obj.TMTitle = v[1];
        _obj.TMTeam = v[3];
        _obj.TMDescription = v[4];
        _obj.TMRank = v[5];
        _obj.TMPmUserNum = v[6];
        _obj.TMPmUserName = v[7];
        _obj.TMRemark = v[8] || '';
        _obj.TMCreatorNum = v[10];
        _obj.TMCreatorName = v[11];
        _obj.TMCreateTime = $.excelFormatDate(v[12]);
        _obj.TMRankDescription = v[16];
        _obj.TMStatus = v[17];
        _obj.TMIsNeedTest = v[18];
        _obj.TMIsRelease = v[21];
        _obj.TMIsCreateFolder = v[22];
        _obj.TMDemandId = v[23];
        // _obj.TMDelTime = v[19];
        _obj.TMApplyPubTime = $.excelFormatDate(v[24]);
        _obj.TMPubTime = $.excelFormatDate(v[25]);
        _obj.TMPubType = v[26];

        // 二进制反解运算
        _obj.TMPlat = $.analysisValue(v[2]);
        _obj.TMTeam = $.analysisValue(v[3]);

        if(v[20]){// 结案时间
            _obj.TMEditTime = v[20];
        }

        if(v[19] != 1){// TMDataFlag
            _obj.TMStatus = 6;
        }

        return _obj;
    },

    // 主任务日志表
    TourismMissionLog: function(v){
        var _obj = {};

        _obj.TMLId = v[0];
        _obj.TMLMissionId = v[1];
        _obj.TMLContent = v[2];
        _obj.TMLCreatorNum = v[3];
        _obj.TMLCreatorName = v[4];
        _obj.TMLCreateDate = $.excelFormatDate(v[5]);

        return _obj;
    },

    // 子任务表
    TourismSubMission: function(v){

        var _obj = {};

        _obj.TSMId = v[0];
        _obj.TSMMissionId = v[1];
        _obj.TSMTitle = v[2];
        _obj.TSMOperatorNum = v[3];
        // _obj.TSMOperatorTeam = v[4];
        _obj.TSMOperatorName = v[5];
        _obj.TSMStartDate = $.excelFormatDate(v[6]);
        _obj.TSMEndDate = $.excelFormatDate(v[7]);
        _obj.TSMPace = v[8];
        _obj.TSMCreatorNum = v[10];
        _obj.TSMCreatorName = v[11];
        _obj.TSMCreateDate = $.excelFormatDate(v[12]);
        _obj.TSMIsValid = v[13];

        // 二进制反解运算
        _obj.TSMSite = $.analysisValue(v[14]);

        return _obj;
    },

    // 子任务日志表
    TourismSubMissionLog: function(v){
        var _obj = {};
        _obj.TSMLId = v[0];
        _obj.TSMLSubMissionId = v[1];
        _obj.TSMLContent = v[2];
        _obj.TSMLCreatorNum = v[3];
        _obj.TSMLCreatorName = v[4];
        _obj.TSMLCreateDate = $.excelFormatDate(v[5]);
        _obj.TSMLMissionId = v[6];
        return _obj;
    },

    // 测试用例表
    TourismMissionCase: function(v){
        var _obj = {};

        _obj.TMCId = v[0];
        _obj.TMCTestTitle = v[1];
        _obj.TMCMissionId = v[2];
        _obj.TMCTestCaseId = v[3];
        _obj.TMCStatus = v[4];
        _obj.TMCCreatorNum = v[5];
        _obj.TMCCreatorName = v[6];
        _obj.TMCCreateDate = $.excelFormatDate(v[7]);
        _obj.TMCIsValid = v[8];
        _obj.TMTimes = v[9];
        _obj.TMCCode = v[10];

        return _obj;
    },

    // 测试用例日志表
    TourismMissionCaseLog: function(v){
        var _obj = {};

        _obj.TMCLId = v[0];
        _obj.TMCLMissionId = v[1];
        _obj.TMCLContent = v[2];
        _obj.TMCLCreatorNum = v[3];
        _obj.TMCLCreatorName = v[4];
        _obj.TMCLCreateDate = $.excelFormatDate(v[5]);
        _obj.TMCLMissionCaseId = v[6];

        return _obj;
    },

    // 任务缺陷表
    TourismBugManage: function(v){
        var _obj = {};

        _obj.TBMId = v[0];
        _obj.TBMMissionId = v[1];
        _obj.TBMTitle = v[2];
        _obj.TBMTestDate = $.excelFormatDate(v[4]);
        _obj.TBMCommitorNum = v[18];
        _obj.TBMCommitorName = v[19];
        _obj.TBMRank = v[7];
        _obj.TBMDealorNum = v[8];
        _obj.TBMDealorName = v[9];
        _obj.TBMVersion = v[10];
        _obj.TBMReappear = v[11] == 1 ? 1 : 2 ;
        _obj.TBMProject = v[12];
        _obj.TBMPlat = $.analysisValue(v[13]);
        _obj.TBMStatus = v[14];
        _obj.TBMDescription = v[15];
        _obj.TBMRemark = v[16];
        _obj.TBMCreatorNum = v[5] || 0;
        _obj.TBMCreatorName = v[6];
        _obj.TBMCreateDate = $.excelFormatDate(v[20]);
        _obj.TBMOptimizationTips = v[21];
        _obj.TBMIsValid = v[22];
        _obj.TBMUpdateDate = $.excelFormatDate(v[23]);

        return _obj;
    },

    // 任务缺陷日志表
    TourismBugManageLog: function(v){
        var _obj = {};

        _obj.TBMLId = v[0];
        _obj.TBMLMissionId = v[1];
        _obj.TBMLBugId = v[2];
        _obj.TBMLContent = v[3];
        _obj.TBMLCreatorNum = v[4];
        _obj.TBMLCreatorName = v[5];
        _obj.TBMLCreateDate = $.excelFormatDate(v[6]);

        return _obj;
    },

    // 发布表
    TourismPublishManage: function(v){
        var _obj = {};

        _obj.TPMId = v[0];
        _obj.TPMSite = $.analysisValue(v[1]);
        _obj.TPMOperatorNum = (v[3] + '').split(',');
        _obj.TPMOperatorName = (v[4] + '').split(',');
        _obj.TPMFlag = v[5] == 1 ? 1 : 2;
        _obj.TPMType = v[6];
        _obj.TPMCreatorNum = (v[8] + '').split(',');
        _obj.TPMCreatorName = (v[9] + '').split(',');
        _obj.TPMCreateDate = $.excelFormatDate(v[10]);
        _obj.TPMMissionId = (v[12] + '').split(',');
        _obj.TPMMissionName = (v[13] + '').split(',');
        _obj.TPMPublishDate = $.excelFormatDate(v[14]);
        _obj.TPMManageDate = $.excelFormatDate(v[15]);
        _obj.TPMApproverNum = (v[17] + '').split(',');
        _obj.TPMApproverName = (v[18] + '').split(',');

        return _obj;
    },

    // 线上Bug表
    TourismOnlineBug: function(v){

        var _obj = {};

        _obj.TOBId = v[0];
        _obj.TOBTitle = v[1];
        _obj.TOBDetail = v[2];
        _obj.TOBOperatorNum = v[3];
        _obj.TOBOperatorName = v[4];
        _obj.TOBOperatorTeam = v[5];
        _obj.TOBSite = $.analysisValue(v[6]);
        _obj.TOBFlag = v[10] == 0 ? 3 : v[7];
        _obj.TOBType = v[8];
        _obj.TOBTypeDate = $.excelFormatDate(v[9]);
        _obj.TOBCreatorNum = v[11];
        _obj.TOBCreatorName = v[12];
        _obj.TOBCreateDate = $.excelFormatDate(v[13]);
        _obj.TOBRank = v[14];
        _obj.TPMApplyDate = $.excelFormatDate(v[15]);

        return _obj;
    },

    // 故障表
    TourismTroubleManage: function(v){

        var _obj = {};

        _obj.TTMId = v[0];
        _obj.TTMTitle = v[1];
        _obj.TTMOperatorNum = v[2];
        _obj.TTMOperatorName = v[3];
        _obj.TTMRank = v[4];
        _obj.TTMStartDate = $.excelFormatDate(v[5]);
        _obj.TTMEndDate = $.excelFormatDate(v[6]);
        _obj.TTMStation = $.analysisValue(v[7]);
        _obj.TTMContent = v[8];
        _obj.TTMCreatorNum = v[9];
        _obj.TTMCreatorName = v[10];
        _obj.TTMCreateDate = $.excelFormatDate(v[11]);
        _obj.TTMIsValid = v[13] == 1 ? 1 : 2;
        _obj.TTMHandleType = v[14];
        _obj.TTMTeam = $.analysisValue(v[15]);

        if(v[16] && v[16].replace(/\D/g, '')) _obj.TTMOrderCount = v[16].replace(/\D/g, '');

        return _obj;
    },

    // 需求表
    TourismDemand: function(v){

        var _obj = {};

        _obj.TDId = v[0];
        _obj.TDDemandTitle = v[1];
        _obj.TDDemandPMNum = v[2];
        _obj.TDDemandPMName = v[3];
        _obj.TDDemandBranch = $.analysisValue(v[4]);
        _obj.TDDemandMakerName = v[6];
        _obj.TDDemandIsDeal = v[7];
        _obj.TDDemandType = v[8];
        _obj.TDDemandTeam = $.analysisValue(v[9]);
        _obj.TDDemandStatus = v[10];
        _obj.TDDemandDes = v[11];
        _obj.TDDemandRank = v[12];
        _obj.TDDemandPlat = $.analysisValue(v[13]);
        _obj.TDDemandDCText = v[14];
        _obj.TDDemandDCStartTime = $.excelFormatDate(v[15]);
        _obj.TDDemandDCPubExpeTime = $.excelFormatDate(v[16]);
        _obj.TDDemandDCPubConfTime = $.excelFormatDate(v[17]);
        _obj.TDDemandDataFlag = v[18] == 1 ? 1 : 2;
        _obj.TDDemandAnalysisSta = v[19];
        _obj.TDDemandRemark = v[20];
        _obj.TDDemandTurnMission = v[22] == 1 ? 1 : 2;
        _obj.TDDemandMissionId = v[23];
        _obj.TDDemandCreateTime = $.excelFormatDate(v[24]);

        return _obj;
    }
};