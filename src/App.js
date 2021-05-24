import React, {Component} from 'react';
import { translate,use,getCurrentLang,getCharDigit} from './translate/TranslateService';


class App extends Component {

  state = {
    mrz: "",
    value: "",
    mrzPart1: "",
    mrzPart2: "",
    currentLang: getCurrentLang(),
    passportData: {
      documentIndicating: "",
      documentType: "",
      issuingState: "",
      personName: "",
      passportNumber: "",
      nationality: "",
      dateofBirth: "",
      sex: "",
      expirydate: "",
      personalNumber: ""
    }
  }

  // getNewDateFormat(date) {
  //   this.changeDateFormat(date);
  // }

  // changeDateFormat(date) {

  //   let dateBirth = new Date(date).toDateString(); 
  //   let year = dateBirth.substr(0, 2);
  //   let month = dateBirth.substr(2, 2);
  //   let day = dateBirth.substr(4, 2);

  //   var newDate = [day, month, year];
  //   return newDate.join('.');
  // }

  handleChange(mrzPart1) {
    let mrzPart2 = mrzPart1.substr(44, mrzPart1.length);
    mrzPart1 = mrzPart1.substr(0, 44);

    this.setState({
      mrzPart1,
      mrzPart2
    });

    if (mrzPart1.length === 44)
      this.focusMrz2();

  }

  focusMrz2() {
    let mrzInput = document.getElementById("mrzPart2");
    mrzInput.focus();
  }

  changeLang(lang) {
    use(lang);
    this.setState({
      currentLang: lang
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let mrz = this.state.mrzPart1 + this.state.mrzPart2;

    try {
      this.checkMRZ(mrz);
      alert(translate('correct_message_mrz'));
    } 
    catch (error) {
      alert(error);
    }
  }

  getScale(idWithoutCheckDigit) {
    let sum = 0;
    for (var i = 0; i < idWithoutCheckDigit.length; i = i + 3) {
      var ch = idWithoutCheckDigit.substr(i, 3);
      ch = String(ch + "   ").substr(0, 3);
      sum += this.checkForThreeKey(ch);
    }
    let digit = sum % 10;
    return digit;
  }

  checkForThreeKey(val) {
    let sumValue = getCharDigit(val[0]) * 7 + getCharDigit(val[1]) * 3 + getCharDigit(val[2]) * 1;
    return sumValue;
  }

  checkMRZ(mrz) {
    if (!mrz || mrz.length !== 88)
      throw (translate('incorrect_message_mrz'));

    var str = mrz.replace(/</g, ' ');
    this.setPassportData(str);
  }

  setPassportData(mrz) {

    let passportData = {
      documentIndicating: mrz.substr(0, 1),
      documentType: mrz.substr(1, 1),
      issuingState: mrz.substr(2, 3),
      personName: mrz.substr(5, 39),
      passportNumber: mrz.substr(44, 9),
      digitPassNum: mrz.substr(53, 1),
      nationality: mrz.substr(54, 3),
      dateofBirth: mrz.substr(57, 6),
      digitDateofBirth: mrz.substr(63, 1),
      sex: mrz.substr(64, 1),
      expirydate: mrz.substr(65, 6),
      digitExpiryDate: mrz.substr(71, 1),
      personalNumber: mrz.substr(72, 14),
      digitPersonalNumber: mrz.substr(86, 1),
      lastDigit: mrz.substr(87, 1),
      digitFirst: mrz.substr(44, 10),
      digitSecond: mrz.substr(57, 7),
      digitThird: mrz.substr(65, 22)
    }

    this.checkPassportData(passportData);
    this.setState({
      passportData
    });
  }

  checkPassportData(passportData) {
    this.checkDigitAndThrowIfWrong(passportData.passportNumber, passportData.digitPassNum, translate('incorrect_message_mrz'));
    this.checkDigitAndThrowIfWrong(passportData.dateofBirth, passportData.digitDateofBirth, translate('incorrect_message_mrz'));
    this.checkDigitAndThrowIfWrong(passportData.expirydate, passportData.digitExpiryDate, translate('incorrect_message_mrz'));
    this.checkDigitAndThrowIfWrong(passportData.personalNumber, passportData.digitPersonalNumber, translate('incorrect_message_mrz'));
    this.finalyCheckDigit(passportData);
  }
  
  checkDigitAndThrowIfWrong(idWithoutCheckDigit, num, message) {
   let digitNum = this.getScale(idWithoutCheckDigit).toString();
    if (num !== digitNum)
      throw (message);
  }

  finalyCheckDigit(passportData) {
    let lastDigit = passportData.digitFirst + passportData.digitSecond + passportData.digitThird;
    this.checkDigitAndThrowIfWrong(lastDigit, passportData.lastDigit, translate('incorrect_message_mrz'));
  }

  render() {
    return (
      <div className="container">
        <div style={{ marginBottom: 40 }}></div>
        <div className="col-md-5 col-md-offset-3" style={{ backgroundColor: '#fff', borderRadius: '10px' }} >
          <div className="text-center"> <h3>{translate('title_check_passport')}</h3><div className="text-center" style={{ marginBottom: 50 }}>
            <button className="btn btn-default" onClick={() => this.changeLang("az")}>az</button>
            <button className="btn btn-default" onClick={() => this.changeLang("en")}>en</button>
            <button className="btn btn-default" onClick={() => this.changeLang("ru")}>ru</button>
          </div>
          </div>
          <div className="col-md-12" style={{ marginBottom: 50 }}>
            <form onSubmit={(e) => this.handleSubmit(e)}>
              <div style={{ marginBottom: 20 }}>
                <label>{translate('title_enter_passport')}</label>
                <input type="text"
                  className="form-control"
                  id="mrzPart1"
                  style={{ fontFamily: 'monospace' }}
                  placeholder={translate('placeholder_passport_mrz_part1')}
                  value={this.state.mrzPart1}
                  onChange={(event) => this.handleChange(event.target.value)}
                />
                <input type="text"
                  className="form-control"
                  id="mrzPart2"
                  maxLength="44"
                  style={{ fontFamily: 'monospace' }}
                  placeholder={translate('placeholder_passport_mrz_part2')}
                  value={this.state.mrzPart2}
                  onChange={(event) => this.setState({ mrzPart2: event.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-default pull-right">{translate('button_submit')}</button></form>
          </div>
            <div className="col-md-12" style={{ marginBottom: 30, fontSize: '15px' }}>
            <div><label>{translate('title_document_indicating')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.documentIndicating}</span></label></div>
            <div><label>{translate('title_document_type')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.documentType}</span></label></div>
            <div><label>{translate('title_issuing_state')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.issuingState}</span></label></div>
            <div><label>{translate('title_person')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.personName}</span></label></div>
            <div><label>{translate('title_passport_number')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.passportNumber}</span></label></div>
            <div><label>{translate('title_gender')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.sex}</span></label></div>
            <div><label>{translate('title_date_of_birth')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.dateofBirth}</span></label></div>
            <div><label>{translate('title_expiration_date_of_passport')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.expirydate}</span></label></div>
            <div><label>{translate('title_personal_number')}:<span style={{ color: '#4150A3' }}> {this.state.passportData.personalNumber}</span></label></div></div>
        </div>
      </div>);
  }
}
// {this.getNewDateFormat(this.state.passportData.dateofBirth)}
export default App;