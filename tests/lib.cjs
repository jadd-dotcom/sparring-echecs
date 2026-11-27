// Aides communes aux tests e2e : fin d'une partie contre Maia (écran « ce que je pensais »).

/** La partie est finie : l'écran de commentaire s'ouvre avec le résultat (avant toute autre chose). */
async function gameEnded(p) {
  await p.waitForURL(/#\/comment\/\d+$/, { timeout: 60000 });
  await p.getByTestId('game-result').waitFor({ timeout: 60000 });
}

/** Attend la fin de l'analyse sur l'écran de commentaire, passe les erreurs (« Plus tard ») et ouvre la revue. */
async function reviewAfterGame(p, timeout = 600000) {
  await gameEnded(p);
  await p.locator('.comment[data-ply], [data-testid="comment-done"]').first().waitFor({ timeout });
  if (await p.locator('.comment[data-ply]').count()) await p.getByRole('button', { name: 'Plus tard' }).tap();
  await p.getByTestId('comment-done').getByRole('button', { name: 'Revoir la partie' }).tap();
}

module.exports = { gameEnded, reviewAfterGame };
