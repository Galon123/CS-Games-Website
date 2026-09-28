import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the wrapper gap
content = content.replace(
    '<div className="flex items-stretch gap-8 md:gap-16 relative">',
    '<div className="flex items-stretch gap-0 relative">'
)

# 2. Update Quarter Finals gap
content = content.replace(
    '<div className="flex flex-col justify-between gap-16 relative w-72 shrink-0">',
    '<div className="flex flex-col justify-between space-y-8 relative w-72 shrink-0">'
)

# 3. Replace QF to SF Connector
old_qf_sf_connector = """              {/* Connector from QF to SF */}
              <div className="absolute left-[288px] top-0 bottom-0 w-8 md:w-16 hidden md:block">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  {/* Q1 & Q2 to S1 */}
                  <path d="M 0 100 L 32 100 L 32 250 L 64 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0 380 L 32 380 L 32 250 L 64 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  {/* Q3 & Q4 to S2 */}
                  <path d="M 0 660 L 32 660 L 32 810 L 64 810" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0 940 L 32 940 L 32 810 L 64 810" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                </svg>
              </div>"""

new_qf_sf_connector = """              {/* Connector from QF to SF */}
              <div className="w-10 shrink-0 hidden md:flex flex-col">
                <div className="mb-4 pb-2.5 invisible flex items-center justify-between" aria-hidden="true">
                  <div className="h-5" />
                </div>
                <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none py-[35px]">
                  {[0, 1].map((pairIdx) => (
                    <div key={pairIdx} className="space-y-2 p-1.5">
                      <div className="h-[162px] flex items-center justify-center">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                          <path d="M 0 0 L 20 0 L 20 100 L 0 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          <path d="M 20 50 L 40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>"""

content = content.replace(old_qf_sf_connector, new_qf_sf_connector)

# 4. Replace SF to F Connector
old_sf_f_connector = """              {/* Connector from SF to F */}
              <div className="absolute left-[640px] top-0 bottom-0 w-8 md:w-16 hidden md:block">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path d="M 0 250 L 32 250 L 32 530 L 64 530" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0 810 L 32 810 L 32 530 L 64 530" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                </svg>
              </div>"""

new_sf_f_connector = """              {/* Connector from SF to F */}
              <div className="w-10 shrink-0 hidden md:flex flex-col">
                <div className="mb-4 pb-2.5 invisible flex items-center justify-between" aria-hidden="true">
                  <div className="h-5" />
                </div>
                <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none py-28">
                  <div className="space-y-2 p-1.5">
                    <div className="h-[250px] flex items-center justify-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                        <path d="M 0 0 L 20 0 L 20 100 L 0 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        <path d="M 20 50 L 40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>"""

content = content.replace(old_sf_f_connector, new_sf_f_connector)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
