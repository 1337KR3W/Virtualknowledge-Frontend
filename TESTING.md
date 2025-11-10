# Virtualknowledge-Frontend-TESTING
      ┌───────────────────────────┐
      |│              🐛         │|
      |│   [ { code(); } 🔐 ]    │|
      |│   [ { tests(); } ✅ ]   │|                                             
      |│   [ { deploy(); } 🌍 ]  │|                                           )
      |│________🐛_______________│|                                       (
      └────────────⚙️─────────────┘                                        ) (
                ⎯⎯⎯⎯⎯⎯⎯⎯                                                 (  ( )
                                                                        ┌──────┐
         [ Q W E R T Y U I O P ]                ____()()                |      |─┐
         [  A S D F G H J K L  ]               /      @@                |      |-'
         [   Z X C V B N M     ]         `~~~~~\_;m__m._>o              └──────┘              



### Ejecutar todas las pruebas unitarias
```
ng test
```
### Ejecutar pruebas con reporte de cobertura
```
ng test --code-coverage
```
### Ejecutar pruebas E2E
```
ng e2e
```
### Para generar un reporte visual
```
ng test --code-coverage
```
### Para generar carpeta coverage/ con informe HTML
```
npx http-server ./coverage
```

## Pruebas E2E con Cypress
```
npm install cypress --save-dev
```

## Configurar script en package.json
```
"scripts": {
  "cypress:open": "cypress open",
  "cypress:run": "cypress run"
}
```

## Ejecutar
```
npm run cypress:open
```

### Ejemplo de estructura básica de un test
```
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```