import React from 'react';
import App from './App'; // App 컴포넌트의 경로를 정확하게

describe('App', () => {
  let dbManager;

  beforeEach(() => {
    cy.mount(<App />);
  });

  describe('달력 기능', () => {
    it('처음 App이 마운트 되었을때 당일 날짜가 체크 되고 포커스 되어 있는지', () => {
      const today = new Date();
      cy.get(`.react-calendar__tile--now`).should('have.class', 'highlight');
    });
    it('달력에서 14일을 클릭하였을때 14일에 highlight 클래스가 제대로 적용되는가?', () => {
      cy.get(`.react-calendar__tile`).contains('14일').click();
      cy.get('.react-calendar__tile--active').should(($element) => {
        expect($element).to.have.class('highlight');
      });
    });
    it('달력에서 다음달로 넘어가는 버튼을 클릭하였을때 달력에서 다음달 월로 제대로 바뀌었는가?', () => {
      //현재 월
      let nowMonth = new Date().getMonth();
      //Date에서 getMonth는 0~11 인덱스로 갖고오기 때문에 달력 컴포넌트에서 숫자를 구하기 위해서는 +1이 아닌 +2를 인덱스에 더해줘야함.
      let nextMonth = nowMonth + 2;
      //다음달로 넘어갔는데 해가 바뀌는 경우
      if (nextMonth > 12) nextMonth -= 12;
      cy.get('.react-calendar__navigation__next-button').click();
      cy.get('.react-calendar__navigation__label__labelText').should(
        'contain',
        `${nextMonth}월`
      );
    });
  });

  describe('운동 계획 기능', () => {
    let inputPlanTxt = '랫풀다운';
    let inputPlanTxt2 = '유산소운동';
    it('미래날짜의 경우에는 계획컴포넌트 생성이 제대로 되는지', () => {
      clickFuture();
      cy.get('.plan-component').should('exist');
    });
    it('미래 일정을 선택한뒤 PlanComponent에 계획을 입력하면 제대로 추가 되는지', () => {
      clickFuture();
      //PlanComponent input창에 계획을 입력하고 엔터를 누른다.
      cy.get('.plan-input').type(inputPlanTxt);
      cy.get('.plan-input').type('{enter}');
      //입력한 계획 내용이 보인다.
      cy.contains('.plan-component', inputPlanTxt).should('be.visible');
    });
    it('입력한 계획을 삭제 버튼 클릭으로 삭제를 해본다', () => {
      cy.get('.plan-input').type(inputPlanTxt);
      cy.get('.plan-input').type('{enter}');
      //계획운동이 제대로 기록 되었는지
      cy.contains('.plan-component', inputPlanTxt).should('be.visible');
      //계획의 삭제버튼을 클릭
      cy.get(`button[data-testid="delete-plan-btn-${inputPlanTxt}"]`).click({
        multiple: true,
      });
      //계획 목록에서 계획운동이 삭제 되었는지
      cy.get('.plan-component').contains(inputPlanTxt).should('not.exist');
    });
    it('당일 날짜에 운동을 계획을 기록하고 Check버튼을 클릭하면 기록 컴포넌트 목록으로 제대로 넘어가는지', () => {
      //벤치프레스 운동을 계획에 등록하여 계획 컴포넌트 목록에 제대로 표시 되는지
      cy.get('.plan-input').type(inputPlanTxt);
      cy.get('.plan-input').type('{enter}');
      cy.contains('.plan-component', inputPlanTxt).should('be.visible');

      //벤치프레스를 수행한 뒤에 Check버튼을 눌러 기록 컴포넌트에 제대로 옮겨 졌는지
      cy.get(`button[data-testid="check-btn-${inputPlanTxt}"]`).click({
        multiple: true,
      });
      cy.get('.past-component').contains(inputPlanTxt).should('be.visible');

      //계획 컴포넌트에서는 벤치프레스 계획 목록이 사라졌는지
      cy.get('.plan-component').contains(inputPlanTxt).should('not.exist');
    });

    it('당일에 계획을 세우고 체크버튼을 통해 기록목록으로 옮긴 운동을 삭제버튼을 클릭하여 지운다.', () => {
      //유산소운동 계획을 작성한다.
      cy.get('.plan-input').type(inputPlanTxt2);
      cy.get('.plan-input').type('{enter}');
      //계획 운동이 제대로 기록되었는지
      cy.contains('.plan-component', inputPlanTxt2).should('be.visible');
      //계획의 체크 버튼 클릭
      cy.get(`button[data-testid="check-btn-${inputPlanTxt2}"]`).click({
        multiple: true,
      });
      //계획 목록에서 삭제 되었는지
      cy.get('.plan-component').contains(inputPlanTxt2).should('not.exist');
      //기록 목록에 추가 되었는지.
      cy.contains('.past-component', inputPlanTxt2).should('be.visible');
      //기록 목록에서 유산소 운동의 삭제버튼을 클릭한다.
      cy.get(`button[data-testid="delete-past-btn-유산소운동"]`).click({
        multiple: true,
      });
      //기록 목록에서 유산소 운동이 삭제되었는지
      cy.get('.past-component').contains(inputPlanTxt2).should('not.exist');
    });
  });
  describe('운동 기록 기능', () => {
    let inputPastInput = '벤치프레스';
    let inputPastInput2 = '덤벨컬';
    it('오늘 및 과거날짜의 경우에는 운동 기록용 컴포넌트가 제대로 생성되는지', () => {
      clickPast();
      cy.get('.past-component').should('exist');
    });

    it('당일 날짜에 운동 기록을 입력하면 운동 기록 컴포넌트에 제대로 추가 되는지', () => {
      cy.get('.past-input').type(inputPastInput);
      cy.get('.past-input').type('{enter}');

      cy.contains('.past-component', inputPastInput).should('be.visible');
    });

    it('당일에 기록한 운동을 삭제버튼을 클릭하여 지운다.', () => {
      //운동을 기록
      cy.get('.past-input').type(inputPastInput2);
      cy.get('.past-input').type('{enter}');
      //운동이 제대로 기록됐는지
      cy.contains('.past-component', inputPastInput2).should('be.visible');
      //기록의 삭제버튼을 클릭
      cy.get(`button[data-testid="delete-past-btn-${inputPastInput2}"]`).click({
        multiple: true,
      });
      //기록 목록에서 덤벨컬이 삭제 되었는지
      cy.get('.past-component').contains(inputPastInput2).should('not.exist');
    });
  });
});

// 미래 (오늘 ~ 일주일 뒤를 선택하는 함수) -> 계획 컴포넌트가 제대로 생성 되는지
function clickFuture() {
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + Math.floor(Math.random() * 8)
  );

  cy.get('.react-calendar__navigation__label__labelText')
    .should(
      'contain',
      `${nextWeek.getFullYear()}년 ${nextWeek.getMonth() + 1}월`
    )
    .then(($label) => {
      if (!$label.text().includes(nextWeek.getMonth() + 1)) {
        cy.get('.react-calendar__navigation__next-button').click(); // 다음 달로 이동
      }
    });

  cy.get('.react-calendar__month-view__days__day')
    .not('.react-calendar__month-view__days__day--neighboringMonth') //달력에 다른 달의 일자도 나와서 다른 달은 선택되지 않도록.
    .contains(nextWeek.getDate())
    .click();
}

function clickPast() {
  const today = new Date();
  const past = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - Math.floor(Math.random() * 8)
  );

  cy.get('.react-calendar__navigation__label__labelText')
    .should('contain', `${past.getFullYear()}년 ${past.getMonth() + 1}월`)
    .then(($label) => {
      if (!$label.text().includes(past.getMonth() + 1)) {
        cy.get('.react-calendar__navigation__prev-button').click();
      }
    });

  cy.get('.react-calendar__month-view__days__day')
    .not('.react-calendar__month-view__days__day--neighboringMonth') //달력에 다른 달의 일자도 나와서 다른 달은 선택되지 않도록.
    .contains(past.getDate())
    .click();
}
