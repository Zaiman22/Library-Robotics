from setuptools import setup

package_name = 'audio_kws'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Zaiman Purnama',
    maintainer_email='zaiman.a.purnama@gmail.com',
    description='audio module for keyword spoting',
    license='Apache License 2.0',
    extras_require={
        'test': [
            'pytest',
        ],
    },
    entry_points={
        'console_scripts': [
            'printer = audio_kws.print_node:main',
        ],
    },
)