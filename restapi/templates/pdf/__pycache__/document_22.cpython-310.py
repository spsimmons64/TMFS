o
    ��if;  �                   @   s�   d dl Z d dlmZ d dlmZmZmZ d dlT d dlT d dl	m
Z
 d dlmZ d dlmZ d dlmZ d d	lmZ d d
lmZ G dd� dee�Zdd� Zdd� Zdd� ZdS )�    N)�BytesIO)�FPDF�Align�	HTMLMixin)�*)�Database)�datetime)�current_app)�Drivers)�Users)�Citadelc                       s.   e Zd Zd
� fdd�	Zdd� Zdd	� Z�  ZS )�PDF�P�in�Letterc                    sR   t � �|||� | jddd� | jddd� | �d� || _|| _|| _d| _d S )	NT�   )�auto�margin�	Helvetica�   ��size�      �?�
   )	�super�__init__�set_auto_page_break�set_font�
set_margin�reseller�account�driver�p_line_height)�selfr   r    r!   �orientation�unit�format��	__class__� �S/home/spsimmons/Development/TMFS/mydriverfiles/restapi/templates/pdf/document_22.pyr      s   

zPDF.__init__c                 C   s  | j dddd� t| jd dd ddd	�}| �|d
d� t� �d| jd �\}}| �d
d
� | jdd| jd �� ddd� | j ddd� |rZ| �	d
� | jdd|d d �� ddd� | �	d
� | jdd| jd �� ddd� | �
d
ddd� | �d
d� | j dddd� d S )Nr   �Br   )�styler   �recordid��   TF)�maxWidth�	maxHeight�stream�encoder   g�������?zTSELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL�      @皙�����?�companyname�Rr   ��w�h�text�align�lnr   r   �emailaddress�	telephoneg      �?�   g      �?�   )r   r,   )r   �get_entity_logor    �imager   �query�set_xy�cell�strip�set_x�line)r#   �logo�eml_set�eml_cntr)   r)   r*   �header   s   
 
z
PDF.headerc                 C   s8  t � �| jd �}| jd � d| jd � d|dd � � �}| �ddd� | �dd	d
d	� | �dd� | �ddd� | jddd� | jddd|� �dddd� | �dd� | jddd� | jddt	d�� d| j
d � d| j
d � d| j
d  � d�dd!� | �d� | jd"d#d$� | �d%d&� | jd| j
d  � d'�d$� d S )(N�socialsecurity�	firstname� �lastnamez& Whose Social Security Number is *****������3   r   g     �#@g     � @g������#@��   r   r   r   g      @r4   z!This Document Pertains To Driver �Cr   )r8   r9   r:   r;   �fillr<   g333333$@r?   g     �@�      �?�   z2024 �	siteroute�.�
sitedomainz Powered By r5   )r8   r9   r:   r<   �   zPage 1 Of 1�r8   r:   g      @g�����L$@z� and associated affiliates do not guarantee the accuracy or validity of the information on this document and assumes no responsibility for the useor misuse of this document and/or any information contained therein.)r   �decryptr!   �set_text_colorrH   rD   �set_fill_colorr   rE   �chrr   rG   �
multi_cell)r#   �
driver_ssn�driver_infor)   r)   r*   �footer*   s   (@
z
PDF.footer)r   r   r   )�__name__�
__module__�__qualname__r   rL   rd   �__classcell__r)   r)   r'   r*   r      s    
r   c                 C   s2   t |�� �}t|||dd�}| j|tj|d� d S )NF)r2   )�name�x�y)r   �read�	get_imagerB   r   rT   )�pdfrB   rk   �maxwidth�	maxheight�
image_data�image_streamr)   r)   r*   �print_image=   s   rs   c                 C   sx  t � �|d �}t� �d|d �}t�tt�|d ���}t� }|j	|dd� t
|dd d�}| j|dd	� | �d
| �� d � | jdt|d d�d� | �d� | jdd� | jddddd� | jdd� | jddddd� | jdd� | �d� | jd|d d� | jdd� | jd|d d� | �d� | jdd� | jddddd� | jdd� | jddd dd� | jdd� d S )!N�userid�users�
esignature�PNG)r&   r.   Fg�������?)ri   rj   �   �333333�?r   �accountsignaturedate�
human_dater\   r4   r?   r   g      @z*Signature Of Individual Making The Inquiry�T�r8   r9   r:   �borderrV   �r8   �   zDate Signedr   r   �signaturename�positionz-Printed Name Of Individual Making The Inquiry�Position)r   �get_user_esignaturer   �fetch�Image�openr   �base64�	b64decode�saverm   rB   rD   �get_yrE   �format_date_timer<   r   )rn   �document�esig_rec�usr_rec�img�image_array�	new_imager)   r)   r*   �print_signatureB   s2   


r�   c           
      C   sf  t � �d|�}|sdS t � �d| �}|sdS t � �d|d �}|s#dS t � �d|d �}|s0dS t|d �}|s:dS t|||�}|��  d	}|jd
d|ddd� |�d� |jddddd� |jdd|d � d|d � �dd� |jdd� |jddddd� |jddt|d d �dd� |�d!� |jddd"dd� |jdd|d# � dd� |jdd� |jddd$dd� |jddt	� �
|d% �dd� |�d!� |jdd&� |jd'd(d)� |jd*d&� |�d� d+}|jd
d�d,d-� |D ��d)� |�d� d.}|jd
d�d/d-� |D ��d)� |�d� d0}|jd
d�d1d-� |D ��d)� |�d� d2}|jd
d�d3d-� |D ��d)� |�d� |jd4d5d)� |�d!� t||� |�d� |jd6|d7 dd8� |jd6|d9 dd8� |d: �rs|jd6|d: dd8� |jd6|d; � d<|d= � d|d> � �dd8� |jd6|d? dd8� |jd6|d@ dd8� tj�tjdA |d � dB��}	|�|	� |	S )CN�driverdocumentsF�driverlicenses�drivers�driverid�accounts�	accountidr-   zeDEPARTMENT OF TRANSPORTATION MOTOR CARRIER SAFETY PROGRAM INQUIRY TO STATE AGENCY FOR DRIVER'S RECORDr3   r4   rT   r   r7   rV   g{�G�z�?ry   zDriver Name:r6   )r8   r9   r:   r;   g      @rN   rO   rP   r+   r}   r   g333333�?zBirth Date:g��Q���?�	birthdater{   r   zLicense Number:�licensenumberzSSN:rM   )r,   r?   zTo Whom It May Concern:r\   � )zUThe above listed individual has made application with us for employment as a driver. zjThe applicant has indicated the above numbered operator's license or permit has been issued by your State z1to the applicant and that it is in good standing.c                 S   �   g | ]}|�qS r)   r)   ��.0�sr)   r)   r*   �
<listcomp>�   �    z#generate_report.<locals>.<listcomp>)zaIn accordance with Section 391.23(a)(1) and (b) of the Federal Motor Carrier Safety Regulations, ziwe are required to make an inquiry into the driving record during the preceding 3 years, to every State, zLin which an applicant has held a motor vehicle operator's license or permit.c                 S   r�   r)   r)   r�   r)   r)   r*   r�   �   r�   )zhTherefore, could you please provide to us, a copy of the driving record for the above listed individual zPfor the preceding 3 years, or certify that no record exists if that be the case.c                 S   r�   r)   r)   r�   r)   r)   r*   r�   �   r�   )zgIn the event this inquiry does not satisfy your requirements for making such inquiries, please send us zfsuch forms as are necessary for us to complete our inquiry into the driving record of this individual.c                 S   r�   r)   r)   r�   r)   r)   r*   r�   �   r�   �   zRespectfully,�   r5   )r8   r:   r<   �address1�address2�cityz, �state�zipcoder>   �fax�	TEMP_PATHz.pdf)r   r�   �get_reseller_from_accountr   �add_pagera   r<   rE   r�   r   r]   r   �joinr�   �os�path�app�config�output)
�	licenseid�
documentid�doc_rec�lic_rec�drv_rec�acc_rec�res_recrn   �big_text�output_pathr)   r)   r*   �generate_report]   sp   
$









,
r�   )r�   �ior   �fpdfr   r   r   �queries�toolbox�databaser   r   �flask_restfulr	   r�   r�   r
   ru   r   �citadelr   r   rs   r�   r�   r)   r)   r)   r*   �<module>   s   /