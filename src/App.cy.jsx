import React from 'react';
import App from './App'; // App 컴포넌트의 경로를 정확하게

describe('App', () => {
    let dbManager;

    beforeEach(() => {
        cy.mount(<App />);
    });
      

  it('처음 App이 마운트 되었을때 당일 날짜가 체크 되고 포커스 되어 있는지', () => {
    const today = new Date();
    cy.get(`.react-calendar__tile--now`).should('have.class', 'highlight');
  });

  it('임의의 날짜를 클릭하였을때 highlight가 제대로 이동 되었는지', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get(`.react-calendar__tile`).contains(tomorrow.getDate()+'일').click();
    cy.get('.react-calendar__tile--active').should(($element) => {
        expect($element).to.have.class('highlight');
      });
  });

  it('미래날짜의 경우에는 계획컴포넌트 생성이 제대로 되는지', () => {
    const today = new Date();
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    cy.get('.react-calendar__navigation__label__labelText')
    .should('contain', `${nextWeek.getFullYear()}년 ${nextWeek.getMonth() + 1}월`)
    .then(($label) => {
        if (!($label.text().includes(nextWeek.getMonth() + 1))) {
        cy.get('.react-calendar__navigation__next-button').click(); // 다음 달로 이동
        }
    });
    
    cy.get('.react-calendar__month-view__days__day')
        .not('.react-calendar__month-view__days__day--neighboringMonth')//달력에 다른 달의 일자도 나와서 다른 달은 선택되지 않도록.
        .contains(nextWeek.getDate())
        .click();

    cy.get('.plan-component').should('exist');
  });

  it('오늘 및 과거날짜의 경우에는 운동 기록용 컴포넌트가 제대로 생성되는지' , () =>{
      const today = new Date();
      const past = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

      cy.get('.react-calendar__month-view__days__day')
        .not('.react-calendar__month-view__days__day--neighboringMonth')//달력에 다른 달의 일자도 나와서 다른 달은 선택되지 않도록.
        .contains(past.getDate())
        .click();
      
    cy.get('.past-component').should('exist');
  })

  it('당일 날짜에 운동 기록을 입력하면 운동 기록 컴포넌트에 제대로 추가 되는지', ()=>{
    cy.get('.past-input').type('사이드 레터럴 레이즈');
    cy.get('.past-input').type('{enter}');

    cy.contains('.past-component', '사이드 레터럴 레이즈').should('be.visible');
  })

  it('미래 일정을 선택한뒤 PlanComponent에 계획을 입력하면 제대로 추가 되는지', () => {
    clickFuture();
    //PlanComponent input창에 계획을 입력하고 엔터를 누른다.
    cy.get('.plan-input').type('랫풀다운');
    cy.get('.plan-input').type('{enter}');
    //입력한 계획 내용이 보인다.
    cy.contains('.plan-component', '랫풀다운').should('be.visible');
    });
  
  it('당일 날짜에 운동을 계획을 기록하고 Check버튼을 클릭하면 기록 컴포넌트 목록으로 제대로 넘어가는지', ()=>{
    //벤치프레스 운동을 계획에 등록하여 계획 컴포넌트 목록에 제대로 표시 되는지
    cy.get('.plan-input').type('벤치프레스');
    cy.get('.plan-input').type('{enter}');
    cy.contains('.plan-component', '벤치프레스').should('be.visible');

    //벤치프레스를 수행한 뒤에 Check버튼을 눌러 기록 컴포넌트에 제대로 옮겨 졌는지 
    cy.get(`button[data-testid="check-btn-벤치프레스"]`).click({ multiple: true });
    cy.get('.past-component').contains('벤치프레스').should('be.visible');
    
    //계획 컴포넌트에서는 벤치프레스 계획 목록이 사라졌는지
    cy.get('.plan-component').contains('벤치프레스').should('not.exist');
  })

  it('당일에 기록한 운동을 삭제버튼을 클릭하여 지운다.', ()=>{
    //덤벨컬 운동을 기록
    cy.get('.past-input').type('덤벨컬');
    cy.get('.past-input').type('{enter}');
    //덤벨컬 운동이 제대로 기록됐는지
    cy.contains('.past-component', '덤벨컬').should('be.visible');
    //기록의 삭제버튼을 클릭
    cy.get(`button[data-testid="delete-past-btn-덤벨컬"]`).click({ multiple: true });
    //기록 목록에서 덤벨컬이 삭제 되었는지
    cy.get('.past-component').contains('덤벨컬').should('not.exist');

  })
  it('당일에 계획한 운동을 삭제버튼을 클릭하여 지운다.', ()=>{
    cy.get('.plan-input').type('계획운동1');
    cy.get('.plan-input').type('{enter}');
    
    //계획운동이 제대로 기록 되었는지
     cy.contains('.plan-component', '계획운동1').should('be.visible');
     //계획의 삭제버튼을 클릭
     cy.get(`button[data-testid="delete-plan-btn-계획운동1"]`).click({ multiple: true });
     //계획 목록에서 계획운동1이 삭제 되었는지
     cy.get('.plan-component').contains('계획운동1').should('not.exist');

  })
  it('당일에 계획을 세우고 체크버튼을 통해 기록목록으로 옮긴 운동을 삭제버튼을 클릭하여 지운다.', ()=>{
    //유산소운동 계획을 작성한다.
    cy.get('.plan-input').type('유산소운동');
    cy.get('.plan-input').type('{enter}');
    //계획 운동이 제대로 기록되었는지
    cy.contains('.plan-component', '유산소운동').should('be.visible');
    //계획의 체크 버튼 클릭
    cy.get(`button[data-testid="check-btn-유산소운동"]`).click({ multiple: true });
    //계획 목록에서 삭제 되었는지
    cy.get('.plan-component').contains('유산소운동').should('not.exist');
    //기록 목록에 추가 되었는지.
    cy.contains('.past-component', '유산소운동').should('be.visible');
    //기록 목록에서 유산소 운동의 삭제버튼을 클릭한다.
    cy.get(`button[data-testid="delete-past-btn-유산소운동"]`).click({ multiple: true });
    //기록 목록에서 유산소 운동이 삭제되었는지
    cy.get('.past-component').contains('유산소운동').should('not.exist');
  })
});

// 미래 (일주일 뒤를 선택하는 함수) -> 계획 컴포넌트가 제대로 생성 되는지
function clickFuture(){
    const today = new Date();
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    cy.get('.react-calendar__navigation__label__labelText')
    .should('contain', `${nextWeek.getFullYear()}년 ${nextWeek.getMonth() + 1}월`)
    .then(($label) => {
        if (!($label.text().includes(nextWeek.getMonth() + 1))) {
        cy.get('.react-calendar__navigation__next-button').click(); // 다음 달로 이동
        }
    });
    
    cy.get('.react-calendar__month-view__days__day')
        .not('.react-calendar__month-view__days__day--neighboringMonth')//달력에 다른 달의 일자도 나와서 다른 달은 선택되지 않도록.
        .contains(nextWeek.getDate())
        .click();
}
