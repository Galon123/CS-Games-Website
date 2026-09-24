
import re

css_path = 'app/globals.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Change --acid colors to burning flame blue
css = css.replace('--acid: 215 242 43;', '--acid: 0 119 255;')
css = css.replace('--acid-hot: 200 255 0;', '--acid-hot: 0 170 255;')
css = css.replace('--acid-ink: 13 15 2;', '--acid-ink: 0 15 35;')
css = css.replace('rgba(215, 242, 43,', 'rgba(0, 119, 255,')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

tw_path = 'tailwind.config.ts'
with open(tw_path, 'r', encoding='utf-8') as f:
    tw = f.read()

# Remove rounded corners
radii = '''      borderRadius: {
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        pill: '999px',
      },'''
tw = re.sub(r'borderRadius: \{[^\}]+\},', radii, tw)

with open(tw_path, 'w', encoding='utf-8') as f:
    f.write(tw)
