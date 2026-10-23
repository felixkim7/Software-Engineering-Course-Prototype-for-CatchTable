// All end-user UI copy (Korean, for the class presentation), keyed by English identifiers.

export const STRINGS = {
  common: {
    cancel: '취소',
    confirm: '확인',
  },

  errors: {
    STORAGE_CORRUPT: '저장된 데모 데이터를 읽을 수 없어 변경하지 못했습니다. 먼저 초기화해 주세요.',
    INVALID_PREFERENCE: '선택할 수 없는 항목입니다.',
    INVALID_STATE: '데모 데이터가 올바르지 않아 변경하지 못했습니다.',
  },

  storage: {
    corrupt: '저장된 데모 데이터를 읽을 수 없습니다. 기존 데이터는 그대로 두었습니다. 초기화하면 새 데모 데이터로 다시 시작합니다.',
    unavailable: '이 브라우저에서는 데모 데이터를 저장할 수 없습니다. 새로고침하면 변경 사항이 사라집니다.',
  },

  hub: {
    pageTitle: '발표자 허브 · 캐치테이블 프로토타입',
    eyebrow: '발표자 허브',
    title: '캐치테이블 재구축 프로토타입',
    mockNotice: '이 프로토타입의 식당, 고객, 예약, 결제, 알림은 모두 가상의 데모 데이터입니다. 실제 예약·결제·메시지 발송은 일어나지 않으며, 데이터는 이 브라우저에만 저장됩니다.',

    stateHeading: '데모 상태',
    baseDate: '기준일',
    demoTime: '데모 시각',
    scenarioEpoch: '시나리오 회차',
    reset: '데모 초기화',
    advance: (minutes) => `시계 +${minutes}분`,
    clockAdvanced: (minutes) => `데모 시각을 ${minutes}분 진행했습니다.`,
    resetDialogTitle: '데모 데이터를 초기화할까요?',
    resetDialogMessage: '모든 데모 기록과 역할 선택이 처음 상태로 돌아갑니다. 진행 중이던 모의 처리 결과는 적용되지 않습니다.',
    resetConfirm: '초기화',
    resetDone: '데모 데이터를 초기화했습니다.',

    identityHeading: '역할 및 사용자',
    roleLegend: '현재 역할',
    roles: { customer: '고객', manager: '매장 관리자' },
    customerLabel: '고객 계정',
    managerLabel: '매장 관리자 계정',
    customerOption: (customer) => `${customer.displayName} (${customer.id})`,
    managerOption: (manager, restaurant) => `${manager.displayName} (${manager.id}) · ${restaurant.name}`,
    roleChanged: (label) => `현재 역할을 ${label}(으)로 바꿨습니다.`,
    identityChanged: (name) => `${name} 계정으로 바꿨습니다.`,

    presetsHeading: '시나리오 준비',
    presetsHint: '데모 초기화는 기본 시작 상태를 만듭니다. 아래 시나리오는 이 데모 버전에서는 아직 제공되지 않습니다.',
    presets: ['웨이팅 진행 중', '취소표 대기 준비', '우선 예약 기회 제공 중', '결제 결과 확인 중', '지각 조율 준비'],

    screensHeading: '화면',
    customerApp: '고객 앱 (모바일)',
    managerApp: '매장 관리자 화면 (데스크톱)',
    uiSample: 'UI 샘플 화면 (모바일)',
    selfCheck: '기초 기능 자체 점검',
    unavailable: '아직 제공되지 않음',
  },

  sample: {
    pageTitle: 'UI 샘플 · 캐치테이블 프로토타입',
    title: 'UI 샘플',
    backToHub: '발표자 허브로 돌아가기',
    typeTitle: '큰 제목 24px',
    typeSection: '섹션 제목 20px',
    typeBody: '본문 15px. 긴 문장이 좁은 화면에서도 단어 단위로 자연스럽게 줄바꿈되는지 확인하기 위한 예시 문장입니다.',
    typeCaption: '보조 설명 12px',
    cardHeading: '카드와 안내',
    cardTitle: '샘플 카드',
    cardBody: '여백, 테두리, 모서리, 그림자 값을 확인하는 중립적인 예시입니다.',
    notice: '보조 안내는 연한 회색 배경 위에 표시합니다.',
    buttonsHeading: '버튼과 대화상자',
    openDialog: '대화상자 열기',
    openDangerDialog: '삭제 확인 열기',
    showToast: '알림 메시지 보기',
    disabled: '사용할 수 없음',
    dialogTitle: '샘플 대화상자',
    dialogMessage: '대화상자 내용 예시입니다. 확인 또는 취소를 선택하세요.',
    dangerDialogTitle: '샘플 항목을 삭제할까요?',
    dangerConfirm: '네, 삭제할게요',
    dialogConfirmed: '확인을 선택했습니다.',
    dialogCancelled: '대화상자를 닫았습니다.',
    toastMessage: '알림 메시지 예시입니다.',
    primaryAction: '다음',
    primaryPressed: '기본 버튼을 눌렀습니다.',
  },
};
