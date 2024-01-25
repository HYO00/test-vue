 export const makeDraggable = (element: HTMLElement) => {
    let posX = 0, posY = 0, posInitX = 0, posInitY = 0;
  
    const dragMouseDown = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      // 마우스 시작 위치 가져오기
      posInitX = e.clientX;
      posInitY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };
  
    const elementDrag = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      // 새 위치 계산
      posX = posInitX - e.clientX;
      posY = posInitY - e.clientY;
      posInitX = e.clientX;
      posInitY = e.clientY;
      // 요소의 새 위치 설정
      element.style.top = (element.offsetTop - posY) + "px";
      element.style.left = (element.offsetLeft - posX) + "px";
    };
  
    const closeDragElement = () => {
      // 드래그 종료 시 이벤트 해제
      document.onmouseup = null;
      document.onmousemove = null;
    };
  
    element.onmousedown = dragMouseDown;
  };
