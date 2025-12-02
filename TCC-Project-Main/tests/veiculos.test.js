const { Builder, By, until } = require('selenium-webdriver');

(async function testCadastroVeiculo() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Acessa a página de cadastro de veículos
        await driver.get('http://localhost:8080/mecanico/veiculo');

        // Preenche o formulário de cadastro de veículo
        await driver.findElement(By.name('modelo')).sendKeys('Fusca');
        await driver.findElement(By.name('marca')).sendKeys('Volkswagen');
        await driver.findElement(By.name('ano')).sendKeys('1971');
        await driver.findElement(By.name('id_cliente')).sendKeys('1');

        // Submete o formulário
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Aguarda o redirecionamento e verifica se o veículo foi cadastrado
        await driver.wait(until.urlContains('/mecanico/painelMecanico'), 5000);
        console.log('Teste de cadastro de veículo: SUCESSO');
    } catch (error) {
        console.error('Teste de cadastro de veículo: FALHA', error);
    } finally {
        await driver.quit();
    }
})();