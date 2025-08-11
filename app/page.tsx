'use client'

import { useState } from 'react'

export default function Home() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showCopyNotification, setShowCopyNotification] = useState(false)

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setShowCopyNotification(true)
      setTimeout(() => {
        setCopiedCode(null)
        setShowCopyNotification(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const workingCodes = [
    { code: 'superduperfunsecretcode', rewards: '5x Locked Element Reroll, 3x Locked Weapon Reroll, 2x World Ticket', isNew: true },
    { code: 'wowshutdowncodeyeah', rewards: '10x Locked Clan Reroll, 5x Locked Element Reroll, 1x Bararaq Extremity', isNew: true },
    { code: 'codeforshutdownisuppose', rewards: '15x Locked Weapon Reroll, 10x Locked Element Reroll, 5x Eye Colour Reroll' },
    { code: 'yesterdayshutdown', rewards: '20x Locked Clan Reroll, 15x Locked Weapon Reroll, 2x Locked Blue Elixir' },
    { code: 'thanksfor900k', rewards: '25x Locked Element Reroll, 20x Locked Weapon Reroll, 3x World Ticket' },
    { code: 'setrona1vertagzeu0', rewards: '30x Locked Element Reroll, 20x Locked Weapon Reroll, 20x Locked Clan Reroll, 20x Clan Reroll, 2x Locked Blue Elixir, 2x Locked Red Elixir' },
    { code: 'excaliburfool', rewards: '40x Locked Element Reroll, 30x Locked Weapon Reroll, 25x Locked Clan Reroll, 20x Weapon Appearance Reroll, 2x Locked Blue Elixir, 2x Locked Red Elixir' },
    { code: 'higuyscode', rewards: '15x Locked Clan Reroll, 10x Locked Weapon Reroll, 10x Locked Element Reroll' },
    { code: 'thisiswhywetestthosewhoknow', rewards: '20x Locked Element Reroll, 20x Eye Colour Reroll, 10x Locked Weapon Reroll, 15x Locked Clan Reroll, 10x Mask Reroll, 10x Mouth Reroll, 1x World Ticket' },
    { code: 'goplayranked', rewards: '10x Locked Element Reroll, 5x Locked Weapon Reroll, 1x World Ticket' },
    { code: 'somebugsfixes', rewards: '15x Locked Clan Reroll, 10x Locked Element Reroll, 2x Locked Blue Elixir' },
    { code: 'raidsfixed', rewards: '20x Locked Weapon Reroll, 15x Locked Element Reroll, 1x Bararaq Extremity' },
    { code: 'thanksforpatience', rewards: '25x Locked Clan Reroll, 20x Locked Weapon Reroll, 3x World Ticket' },
    { code: '800kcodeyeah', rewards: '30x Locked Element Reroll, 25x Locked Weapon Reroll, 2x Locked Red Elixir' },
    { code: 'rerererelease', rewards: '1x Bararaq Extremity, 10x Locked Clan Reroll, 10x Locked Weapon Reroll, 10x Locked Element Reroll' },
    { code: 'compensationforinconvenientrelease', rewards: '10x Locked Weapon Reroll, 10x Locked Clan Reroll, 15x Locked Element Reroll' },
    { code: 'promiseddecembercode', rewards: '5x Locked Weapon, 5x Locked Clan Reroll, 5x Eyes Reroll, 10x Eyecolor Reroll, 10x Mouth Reroll, 10x Locked Element Reroll' },
    { code: 'privateservercompensation', rewards: '1x Bararaq Extremity, 1x World Ticket, 10x Locked Clan Reroll, 10x Weapon Appearance Reroll, 15x Locked Element Reroll' },
    { code: '3daysthosewhoknow', rewards: '1x Bararaq Extremity Wrapped, 5x Locked Element Reroll, 10x Locked Clan Reroll, 10x Locked Weapon Reroll' },
    { code: 'sorryforthebankbugs', rewards: '10x Locked Element Reroll, 10x Locked Clan Reroll, 10x Locked Weapon Reroll, 10x Locked Eyes Reroll' },
    { code: 'mythoughtsonthislater', rewards: '15x Locked Element Reroll, 10x Locked Weapon Reroll, 1x World Ticket' },
  ]

  const expiredCodes = [
    'mythoughtsonthislater', '100kfavourites', '100mlikes', '10klikes', '1kcristi', '200klikeswoah',
    '20klikes', '2weekdelaywoah', '300mvisits', '350mvisitsalright', '35klikes', '3shikaireroll',
    '500kdiscmemberswoo', '500mvisitsthankyou', '55klikes', '700kwoahthanks', '7staredwardnewgate',
    '80Klikes', '8by2typejole', 'abracadabra', 'afkworld', 'AllAccordingToCake', 'almightyeye',
    'anextracode', 'angrycanadian', 'anotherbrickedshutdown', 'apologycode', 'apologyforlate',
    'arrogantecristi5k', 'avaricecascade', 'avengerlevelthreat', 'awesomesauce', 'badquincy',
    'balancedbalance', 'bararaqgbincident', 'Benihimebuff', 'blazblueincident', 'bloodedged',
    'breathlesspumpkle', 'brovisitedhisfriends', 'canyougiftmeacinmightyomega', 'canyouwrap',
    'causethatstheupdateineed', 'cctokenfix', 'championship', 'championshipandmasteryboxes',
    'clanwarupdate', 'classicat600amsaidcodeperoxidedidmygloriouskingdirty', 'code1',
    'codeforvoonithestrongestsoulispeak', 'codethatsenkumadecuzhesmakingsomethingtakethisgiftbecauseitsjustasimpleupdate',
    'contentcoming', 'cowoe10k', 'cowoenuovaentvari', 'cowoesorry', 'cristi10k', 'cristiqol',
    'cursedgearruinsfriendships', 'cyberpoint', 'davehashit10kwow', 'ddanielisevil', 'delayedwhoops',
    'devilgene', 'didntyousaynoupdtonight', 'doomaroomeneverexisted', 'doomatearoom', 'drakos10k',
    'eduardobrg', 'eduardobrg10k', 'eduardocarrying', 'entvari10k', 'ermwhatthetypesoul',
    'ermwhattthetypesoul', 'explodeincident', 'fixedoldcode', 'flowerfinally',
    'gokuvsvegetasupersaiyanrapbattlebegin', 'guesswhosback', 'gutteddodgevariantgobrrr',
    'hakudanerfafter1000years', 'happyeaster', 'happyfortuneentvariblessing', 'happyhalloween',
    'haveagoodday', 'hellopiety', 'helpeduardosmentalsanity', 'higuys',
    'higuysdanielhereiaddedacodefrompadocforafriskerwithidkspecialfriskeraswell',
    'higuysdanielhereiaddedacodefrompadocforafriskerwithidkspecialfriskeraswellAGAINTWICE',
    'hqrsepowered', 'ididntgetopenedupiliterallyjustgottiredofblocking', 'idontdotheseoften',
    'imnotnamingitthat', 'imsorry', 'ineedasacredscrollindemonhuntertm', 'itstypesoulfriday',
    'jayomalawfirm', 'JEANETTEFOUND', 'joedame', 'johnbooming', 'johnboomingg', 'joshnosreppcristi',
    'kamehamehax3', 'khaotic10k', 'khaoticyachty', 'latenightbruh', 'latenightfightnig',
    'rankedseason2', 'readysetboomxdgetitbecauseboomboominokwhateverheresacode',
    'reallycoolcodehaha', 'reallycooloriginalcodename', 'redeem72024', 'resetclan', 'robloxban',
    'robotcowoe', 'secretcodethatgives1000rerolls', 'segundanextupdate', 'senkuwascloudkageinjoedame',
    'setroboominda', 'setrohadtoguesswhatthiscodewasnamed', 'shikaireroll', 'shutdownsrry',
    'slowpace', 'somethingrandom', 'soonupdates', 'sorry4ranked3', 'sorrybugs', 'sorryforbank',
    'sorryfordelays', 'sorryforshutdown', 'sorryforthat', 'sorryfortheinconvenienceee',
    'sorryfortheshutdowns', 'sorryhopethishelps', 'soulianstreak', 'sozforbrick', 'sozformobile',
    'spendingthanksgivingontype', 'spiritgun', 'stefan10kfollowers', 'streamericdoa', 'sundayupdate',
    'supasta', 'tama62121', 'tamacodesareback', 'tamaforyoutamaforall', 'tamaiscool',
    'tamaonetwothreefour', 'tamapackageone', 'tamarandomcode', 'tamastrikesagain', 'tamasuigetsu',
    'tamataisentwo', 'tamaverified', 'tamayaren', 'teleportswentdown',
    'thatoneguyinvcaskedmeforthisonesoblamehim',
    'thegreattypesoultrellolieisrealtyfor10kbtw', 'thehonoredone', 'thekiraevent',
    'thekiraeventparttwo', 'thereisnosuchthing', 'theresahiddennpcsomewhere',
    'therewasnotruebankaiinthefirstplace', 'thisisnotsigma', 'thosewhoknowmango',
    'threatneutralized', 'timetravellermistake', 'tradehub', 'triplethreat', 'tsugokusenku',
    'tweakinpostupdate', 'tyforfollows', 'updatecomingsoon', 'veil10k', 'visionaryrework',
    'vultures', 'wasitworthit', 'watermelon', 'weareback', 'wednesdaypatchesmoreplz',
    'weekendgiftorsomething', 'weloveeduardo', 'wereached400mvisits', 'whatdoesheevendo',
    'whenwedance', 'whereiskendoweapondude', 'wheresmybuddy', 'whocareswhatthenameis',
    'whodathuh', 'whoops', 'windwake', 'woahreal', 'yessirupdatetime', 'yippeweekly',
    'youaremyspecialbuddy', 'youcanrollraresnow:)', 'youdidntexpectheretobeasecondonedidyou', 'yurrrrlistenman'
  ]

  return (
    <div className="min-h-screen bg-escapist-bg">
             {/* The Escapist Header */}
       <header className="bg-escapist-card border-b border-escapist-border">
         {/* Main Header */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-3xl font-bold text-escapist-text">Type Soul Codes</h1>
               <p className="text-escapist-text-secondary mt-2">Complete Guide & Working Codes for August 2025</p>
             </div>
             <div className="text-right">
               <div className="text-2xl font-bold text-escapist-accent">{workingCodes.length}</div>
               <div className="text-sm text-escapist-text-secondary">Working Codes</div>
             </div>
           </div>
         </div>
       </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-escapist-card rounded-lg border border-escapist-border p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-escapist-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">🎮</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-escapist-text mb-4">What Are Type Soul Codes?</h2>
              <p className="text-escapist-text-secondary text-lg leading-relaxed mb-4">
                Type Soul codes provide free rewards like Locked Weapon Rerolls, Element Rerolls, and World Tickets in this popular Roblox game.
              </p>
              <p className="text-escapist-text-secondary">
                In Type Soul, you'll transform into powerful beings like reapers or monsters to battle enemies. These codes help you build up your character with better weapons and abilities for epic fights.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-escapist-card border border-escapist-border rounded-lg p-6 hover:border-escapist-accent transition-colors">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-escapist-success rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">✓</span>
              </div>
              <div>
                <p className="text-escapist-text-secondary text-sm">Working Codes</p>
                <p className="text-3xl font-bold text-escapist-text">{workingCodes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-escapist-card border border-escapist-border rounded-lg p-6 hover:border-escapist-accent transition-colors">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-escapist-error rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">✗</span>
              </div>
              <div>
                <p className="text-escapist-text-secondary text-sm">Expired Codes</p>
                <p className="text-3xl font-bold text-escapist-text">{expiredCodes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-escapist-card border border-escapist-border rounded-lg p-6 hover:border-escapist-accent transition-colors">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-escapist-accent rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">🆕</span>
              </div>
              <div>
                <p className="text-escapist-text-secondary text-sm">New Codes</p>
                <p className="text-3xl font-bold text-escapist-text">{workingCodes.filter(code => code.isNew).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Working Codes Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-escapist-text">Working Type Soul Codes</h2>
            <div className="flex items-center space-x-4">
              <span className="text-escapist-text-secondary text-sm">Last updated: August 10, 2025</span>
              <button
                onClick={() => {
                  const allCodes = workingCodes.map(code => code.code).join('\n')
                  copyToClipboard(allCodes)
                }}
                className="bg-escapist-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-escapist-accent-hover transition-colors"
                title="Copy all working codes"
              >
                📋 Copy All Codes
              </button>
            </div>
          </div>
          
          <div className="bg-escapist-card border border-escapist-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-escapist-bg border-b border-escapist-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-escapist-text-secondary uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-escapist-text-secondary uppercase tracking-wider">
                      Rewards
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-escapist-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-escapist-border">
                  {workingCodes.map((code, index) => (
                    <tr key={index} className="hover:bg-escapist-bg transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                                                     <div className="flex items-center space-x-3">
                             <code className="font-mono bg-escapist-bg border border-escapist-border px-4 py-2 rounded text-escapist-text font-semibold">
                               {code.code}
                             </code>
                             <button
                               onClick={() => copyToClipboard(code.code)}
                               className={`px-3 py-1.5 rounded text-xs font-bold transition-all duration-200 ${
                                 copiedCode === code.code 
                                   ? 'bg-escapist-success text-white' 
                                   : 'bg-escapist-accent text-white hover:bg-escapist-accent-hover'
                               }`}
                               title={copiedCode === code.code ? 'Copied!' : 'Copy code'}
                             >
                               {copiedCode === code.code ? '✓ Copied!' : '📋 Copy'}
                             </button>
                           </div>
                          {code.isNew && (
                            <span className="bg-escapist-accent text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {code.rewards.split(', ').map((reward, idx) => (
                            <span key={idx} className="bg-escapist-bg border border-escapist-border text-escapist-text px-3 py-1 rounded text-sm">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-escapist-success text-white">
                          ✓ Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How to Redeem Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-escapist-text mb-6">How to Redeem Type Soul Codes</h2>
          <div className="bg-escapist-card border border-escapist-border rounded-lg p-6">
            <p className="text-escapist-text-secondary mb-6">
              Follow these steps to redeem your Type Soul codes and get free rewards:
            </p>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-escapist-accent text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </span>
                <div>
                  <p className="text-escapist-text font-medium">Launch Roblox and open Type Soul</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-escapist-accent text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </span>
                <div>
                  <p className="text-escapist-text font-medium">Level up your character to at least level 10</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-escapist-accent text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </span>
                <div>
                  <p className="text-escapist-text font-medium">Look for the gift box icon in the game interface</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-escapist-accent text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </span>
                <div>
                  <p className="text-escapist-text font-medium">Type a code into the text box and press Enter</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Expired Codes Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-escapist-text mb-6">Expired Type Soul Codes</h2>
          <div className="bg-escapist-warning/10 border border-escapist-warning/20 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-escapist-warning mr-2">⚠️</span>
              <p className="text-escapist-warning font-medium">
                These codes have expired and are no longer redeemable.
              </p>
            </div>
          </div>
          
          <div className="bg-escapist-card border border-escapist-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {expiredCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between bg-escapist-bg px-4 py-3 rounded border border-escapist-border hover:border-escapist-accent transition-colors">
                  <code className="font-mono text-escapist-text-secondary truncate text-sm">
                    {code}
                  </code>
                  <span className="ml-2 bg-escapist-error text-white px-2 py-1 rounded-full text-xs font-bold">
                    Expired
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

                 {/* Footer */}
         <div className="bg-escapist-card border border-escapist-border rounded-lg p-6 text-center">
           <p className="text-escapist-text-secondary mb-4">
             If you notice any codes are missing or have expired, please let us know and we'll update this list.
           </p>
           <div className="text-sm text-escapist-text-secondary mb-4">
             <p>Guide by The Escapist Team</p>
             <p>Last updated: August 10, 2025</p>
           </div>
           
           {/* Simple Contact Section */}
           <div className="border-t border-escapist-border pt-4">
             <h3 className="text-base font-medium text-escapist-text mb-3">联系我们 / Contact Us</h3>
             <div className="text-sm text-escapist-text-secondary space-y-1">
               <p>📧 Email: 2569861854@qq.com</p>
               <p>🐦 Twitter: @zou_yuxian30976</p>
               <p>🌐 Website: zousir520.github.io/type-soul-code</p>
             </div>
           </div>
         </div>
        
        {/* Copy Success Notification */}
        {showCopyNotification && (
          <div className="fixed top-8 right-8 bg-escapist-success text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✓</span>
              <span className="font-semibold">Code copied to clipboard!</span>
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-escapist-accent text-white p-4 rounded-full shadow-lg hover:bg-escapist-accent-hover transition-all duration-200 transform hover:scale-110 z-50"
          title="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </main>
    </div>
  )
}
